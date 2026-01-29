import { Voice, VoiceState } from './Voice';
import { ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';
import { AudioControlEvent } from '../types/audio';

export class VoiceManager {
  private context: AudioContext;
  private voices: Voice[] = [];
  private maxVoices: number = 64;
  private currentVoiceIndex: number = 0;
  
  // Voice group management for polyphony
  private voiceGroups: Map<number, Voice[]> = new Map();
  private notePolyphonyCounters: Map<number, number> = new Map();
  private groupPolyphonyLimits: Map<number, number> = new Map();

  constructor(context: AudioContext, maxVoices: number = 64) {
    this.context = context;
    this.maxVoices = maxVoices;
    
    // Pre-allocate voices
    for (let i = 0; i < maxVoices; i++) {
      this.voices.push(new Voice(context));
    }
  }

  triggerVoice(region: ParseOpcodeObj, buffer: AudioBuffer, event: AudioControlEvent): Voice | null {
    // Check polyphony limits first
    if (!this.checkPolyphony(region, event.note)) {
      return null;
    }

    // Find a free voice or steal the oldest one
    let voice = this.findFreeVoice();
    
    if (!voice) {
      voice = this.stealVoice();
    }

    if (voice && voice.startVoice(region, buffer, event)) {
      // Register voice in appropriate groups
      const groupIndex = region.group || 0;
      const groupVoices = this.getGroupVoices(groupIndex);
      groupVoices.push(voice);
      this.incrementNotePolyphony(event.note);
      return voice;
    }

    return null;
  }

  private findFreeVoice(): Voice | null {
    // First pass: look for truly free voices
    for (const voice of this.voices) {
      if (voice.isFree()) {
        return voice;
      }
    }

    // Second pass: look for voices that should be cleaned up
    for (const voice of this.voices) {
      if (voice.shouldCleanUp()) {
        voice.stop();
        return voice;
      }
    }

    return null;
  }

  private stealVoice(): Voice | null {
    // Find the oldest released voice, or oldest playing voice if none released
    let oldestVoice: Voice | null = null;
    let oldestAge = -1;

    // First try to find released voices
    for (const voice of this.voices) {
      if (voice.isActive() && voice.getAge() > oldestAge) {
        oldestVoice = voice;
        oldestAge = voice.getAge();
      }
    }

    if (oldestVoice) {
      oldestVoice.stop();
      return oldestVoice;
    }

    return null;
  }

  noteOff(noteNumber: number) {
    console.log(`🎵 VoiceManager.noteOff: note=${noteNumber}, total voices=${this.voices.length}`);
    let activeVoices = 0;
    let matchingVoices = 0;
    
    for (const voice of this.voices) {
      if (voice.isActive()) {
        activeVoices++;
        const triggerEvent = voice.getTriggerEvent();
        if (triggerEvent?.note === noteNumber) {
          matchingVoices++;
          console.log(`🎵 VoiceManager.noteOff: calling handleNoteOff on voice with note=${triggerEvent.note}`);
          voice.handleNoteOff(noteNumber);
        } else {
          console.log(`🎵 VoiceManager.noteOff: voice note mismatch, myNote=${triggerEvent?.note}, target=${noteNumber}`);
        }
      }
    }
    
    console.log(`🎵 VoiceManager.noteOff: processed ${activeVoices} active voices, ${matchingVoices} matching voices`);
    
    // If no voices were found for this note, it might be because the voice is still being created
    // This can happen with async voice triggering. We'll handle this by checking again in the next audio frame
    if (matchingVoices === 0) {
      console.log(`🎵 VoiceManager.noteOff: no matching voices found, scheduling check for next frame`);
      setTimeout(() => {
        console.log(`🎵 VoiceManager.noteOff: checking for delayed voice creation`);
        for (const voice of this.voices) {
          if (voice.isActive()) {
            const triggerEvent = voice.getTriggerEvent();
            if (triggerEvent?.note === noteNumber) {
              console.log(`🎵 VoiceManager.noteOff: found delayed voice, calling handleNoteOff`);
              voice.handleNoteOff(noteNumber);
              return;
            }
          }
        }
        console.log(`🎵 VoiceManager.noteOff: still no matching voices found after delay`);
      }, 0);
    }
  }

  renderBlock(blockSize: number) {
    let activeVoices = 0;
    let cleanedUpVoices = 0;
    
    // Clean up finished voices and render active ones
    for (const voice of this.voices) {
      if (voice.shouldCleanUp()) {
        voice.stop();
        cleanedUpVoices++;
      } else if (voice.isActive()) {
        voice.renderBlock([], blockSize);
        activeVoices++;
      }
    }
    
    // Only log when there are changes
    if (activeVoices > 0 || cleanedUpVoices > 0) {
      console.log(`🎵 VoiceManager.renderBlock: processed ${activeVoices} active voices, ${cleanedUpVoices} cleaned up`);
    }
  }

  stopAll() {
    for (const voice of this.voices) {
      voice.stop();
    }
  }

  /**
   * Check if there are active voices for a specific note
   */
  hasActiveVoicesForNote(noteNumber: number): boolean {
    return this.voices.some(voice => {
      const triggerEvent = voice.getTriggerEvent();
      return voice.isActive() && 
             triggerEvent?.note === noteNumber &&
             triggerEvent?.velocity > 0;
    });
  }

  /**
   * Release all voices that are currently sustaining (due to sustain pedal)
   */
  releaseSustainedNotes() {
    for (const voice of this.voices) {
      if (voice.isActive()) {
        voice.handleSustainRelease();
      }
    }
  }

  /**
   * Get active voice count
   */
  getActiveVoiceCount(): number {
    return this.voices.filter(voice => voice.isActive()).length;
  }

  /**
   * Register CC event - handle sustain pedal release
   */
  registerCC(delay: number, ccNumber: number, ccValue: number) {
    for (const voice of this.voices) {
      if (voice.isActive()) {
        voice.registerCC(delay, ccNumber, ccValue);
      }
    }
  }

  /**
   * Get active voices for a specific group
   */
  getGroupVoices(groupIndex: number): Voice[] {
    if (!this.voiceGroups.has(groupIndex)) {
      this.voiceGroups.set(groupIndex, []);
    }
    return this.voiceGroups.get(groupIndex)!;
  }

  /**
   * Get note polyphony count
   */
  getNotePolyphonyCount(noteNumber: number): number {
    return this.notePolyphonyCounters.get(noteNumber) || 0;
  }

  /**
   * Increment note polyphony count
   */
  incrementNotePolyphony(noteNumber: number): void {
    const count = this.getNotePolyphonyCount(noteNumber) + 1;
    this.notePolyphonyCounters.set(noteNumber, count);
  }

  /**
   * Decrement note polyphony count
   */
  decrementNotePolyphony(noteNumber: number): void {
    const count = Math.max(0, this.getNotePolyphonyCount(noteNumber) - 1);
    if (count === 0) {
      this.notePolyphonyCounters.delete(noteNumber);
    } else {
      this.notePolyphonyCounters.set(noteNumber, count);
    }
  }

  /**
   * Check and enforce polyphony limits
   */
  checkPolyphony(region: ParseOpcodeObj, noteNumber: number): boolean {
    // Check note polyphony
    if (region.note_polyphony) {
      const currentCount = this.getNotePolyphonyCount(noteNumber);
      if (currentCount >= region.note_polyphony) {
        // Find oldest voice for this note and steal it
        const groupVoices = this.getGroupVoices(region.group || 0);
        const noteVoices = groupVoices.filter(v => 
          v.isActive() && v.getTriggerEvent()?.note === noteNumber
        );
        
        if (noteVoices.length > 0) {
          // Sort by age and steal the oldest
          noteVoices.sort((a, b) => a.getAge() - b.getAge());
          noteVoices[0].stop();
        }
        return false;
      }
    }

    // Check group polyphony
    const groupLimit = this.groupPolyphonyLimits.get(region.group || 0);
    if (groupLimit) {
      const groupVoices = this.getGroupVoices(region.group || 0);
      const activeGroupVoices = groupVoices.filter(v => v.isActive()).length;
      
      if (activeGroupVoices >= groupLimit) {
        // Find oldest voice in group and steal it
        const sortedVoices = groupVoices
          .filter(v => v.isActive())
          .sort((a, b) => a.getAge() - b.getAge());
        
        if (sortedVoices.length > 0) {
          sortedVoices[0].stop();
        }
        return false;
      }
    }

    return true;
  }
}
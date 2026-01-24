import { Voice, VoiceState } from './Voice';
import { ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';
import { AudioControlEvent } from '../types/audio';

export class VoiceManager {
  private context: AudioContext;
  private voices: Voice[] = [];
  private maxVoices: number = 64;
  private currentVoiceIndex: number = 0;

  constructor(context: AudioContext, maxVoices: number = 64) {
    this.context = context;
    this.maxVoices = maxVoices;
    
    // Pre-allocate voices
    for (let i = 0; i < maxVoices; i++) {
      this.voices.push(new Voice(context));
    }
  }

  triggerVoice(region: ParseOpcodeObj, buffer: AudioBuffer, event: AudioControlEvent): Voice | null {
    // Find a free voice or steal the oldest one
    let voice = this.findFreeVoice();
    
    if (!voice) {
      voice = this.stealVoice();
    }

    if (voice && voice.startVoice(region, buffer, event)) {
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
    for (const voice of this.voices) {
      if (voice.isActive()) {
        voice.handleNoteOff(noteNumber);
      }
    }
  }

  renderBlock(blockSize: number) {
    // Clean up finished voices and render active ones
    for (const voice of this.voices) {
      if (voice.shouldCleanUp()) {
        voice.stop();
      } else if (voice.isActive()) {
        voice.renderBlock([], blockSize);
      }
    }
  }

  stopAll() {
    for (const voice of this.voices) {
      voice.stop();
    }
  }

  getActiveVoiceCount(): number {
    return this.voices.filter(voice => voice.isActive()).length;
  }
}
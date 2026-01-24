import { ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';
import { AudioControlEvent } from '../types/audio';
import { SFZEngine } from './SFZEngine';

export enum VoiceState {
  Idle,
  Playing,
  Released,
  CleanUp
}

export class ADSREnvelope {
  private attack: number = 0;
  private decay: number = 0;
  private sustain: number = 1;
  private releaseTime: number = 0.1;
  private stage: 'attack' | 'decay' | 'sustain' | 'release' | 'idle' = 'idle';
  private value: number = 0;
  private targetValue: number = 0;
  private rate: number = 0;
  private sampleRate: number;

  constructor(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  setADSR(attack: number, decay: number, sustain: number, release: number) {
    this.attack = Math.max(0.001, attack);
    this.decay = Math.max(0.001, decay);
    this.sustain = Math.max(0, Math.min(1, sustain));
    this.releaseTime = Math.max(0.001, release);
  }

  trigger() {
    this.stage = 'attack';
    this.targetValue = 1;
    this.rate = 1 / (this.attack * this.sampleRate);
  }

  startRelease() {
    if (this.stage !== 'idle') {
      this.stage = 'release';
      this.targetValue = 0;
      this.rate = this.value / (this.releaseTime * this.sampleRate);
    }
  }

  process(): number {
    switch (this.stage) {
      case 'attack':
        this.value += this.rate;
        if (this.value >= 1) {
          this.value = 1;
          this.stage = 'decay';
          this.targetValue = this.sustain;
          this.rate = (1 - this.sustain) / (this.decay * this.sampleRate);
        }
        break;
      case 'decay':
        this.value -= this.rate;
        if (this.value <= this.sustain) {
          this.value = this.sustain;
          this.stage = 'sustain';
        }
        break;
      case 'sustain':
        this.value = this.sustain;
        break;
      case 'release':
        this.value -= this.rate;
        if (this.value <= 0) {
          this.value = 0;
          this.stage = 'idle';
        }
        break;
    }
    return this.value;
  }

  isActive(): boolean {
    return this.stage !== 'idle';
  }

  isReleased(): boolean {
    return this.stage === 'release' || this.stage === 'idle';
  }
}

export class Voice {
  private context: AudioContext;
  private region: ParseOpcodeObj | null = null;
  private buffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode;
  private outputNode: AudioNode;
  private state: VoiceState = VoiceState.Idle;
  private ampEnvelope: ADSREnvelope;
  private triggerEvent: AudioControlEvent | null = null;
  private age: number = 0;
  private sourcePosition: number = 0;
  private loopStart: number = 0;
  private loopEnd: number = 0;
  private sampleEnd: number = 0;
  private playbackRate: number = 1;
  private isNoteOff: boolean = false;
  private sfzEngine: SFZEngine;
  private crossfadeGain: number = 1;

  constructor(context: AudioContext) {
    this.context = context;
    this.gainNode = context.createGain();
    this.outputNode = this.gainNode;
    this.ampEnvelope = new ADSREnvelope(context.sampleRate);
    this.sfzEngine = new SFZEngine(context);
  }

  startVoice(region: ParseOpcodeObj, buffer: AudioBuffer, event: AudioControlEvent): boolean {
    console.log(`🎵 Voice.startVoice: note=${event.note}, sample=${region.sample}, loop_mode=${region.loop_mode}`);
    
    this.region = region;
    this.buffer = buffer;
    this.triggerEvent = event;
    this.state = VoiceState.Playing;
    this.age = 0;
    this.isNoteOff = false;

    // Setup envelope from region with proper defaults
    const attack = Math.max(0.001, (region.ampeg_attack || 0) / 1000);
    const decay = Math.max(0.001, (region.ampeg_decay || 0) / 1000);
    const sustain = region.ampeg_sustain !== undefined ? Math.max(0, Math.min(1, region.ampeg_sustain)) : 1;
    const release = Math.max(0.1, (region.ampeg_release || 1000) / 1000);
    
    console.log(`📊 Envelope: A=${attack}s, D=${decay}s, S=${sustain}, R=${release}s`);
    this.ampEnvelope.setADSR(attack, decay, sustain, release);

    this.ampEnvelope.trigger();
    console.log('🚀 Voice started successfully');
    
    this.crossfadeGain = this.sfzEngine.calculateCrossfade(region, event.velocity, event.note);
    if (this.crossfadeGain <= 0) {
      return false;
    }

    this.sourcePosition = this.sfzEngine.calculateSampleOffset(region);
    this.sampleEnd = this.sfzEngine.calculateSampleEnd(region, buffer.length);
    this.loopStart = region.loop_start || 0;
    this.loopEnd = Math.min(region.loop_end || this.sampleEnd, this.sampleEnd);

    const pitchCents = this.sfzEngine.calculatePitchModulation(region, event.note, event.velocity);
    this.playbackRate = this.sfzEngine.centsToRatio(pitchCents);

    this.source = this.context.createBufferSource();
    this.source.buffer = buffer;
    this.source.playbackRate.value = this.playbackRate;
    
    this.sfzEngine.setupLooping(region, this.source, this.context.sampleRate);

    if (region.loop_mode === 'loop_continuous') {
      this.source.onended = null;
    } else {
      this.source.onended = () => {
        if (region.loop_mode === 'one_shot') {
          console.log('📊 One-shot ended, starting release');
          this.ampEnvelope.startRelease();
        }
      };
    }

    this.outputNode = this.sfzEngine.processRegion(region, this.source, this.gainNode);
    this.outputNode.connect(this.context.destination);

    // Calculate base gain from volume (dB) and amplitude (linear)
    let baseGain = this.crossfadeGain;
    if (region.volume !== undefined) {
      baseGain *= Math.pow(10, region.volume / 20); // Convert dB to linear
    }
    if (region.amplitude !== undefined) {
      baseGain *= region.amplitude;
    }
    
    // Apply velocity scaling
    baseGain *= event.velocity;
    
    this.gainNode.gain.value = baseGain;
    console.log(`🔊 Setting gain: crossfade=${this.crossfadeGain}, velocity=${event.velocity}, final=${baseGain}`);
    
    const startOffset = this.sourcePosition / this.context.sampleRate;
    const duration = region.loop_mode === 'one_shot' ? 
      (this.sampleEnd - this.sourcePosition) / this.context.sampleRate : undefined;
    
    try {
      // Resume audio context if suspended (synchronously)
      if (this.context.state === 'suspended') {
        this.context.resume();
        console.log('🔊 Audio context resume requested');
      }
      
      this.source.start(0, startOffset, duration);
      console.log(`🎵 Source started: offset=${startOffset}s, duration=${duration}s`);
    } catch (e) {
      console.warn('Failed to start voice:', e);
      return false;
    }

    return true;
  }

  renderBlock(outputBuffer: Float32Array[], blockSize: number) {
    if (this.state !== VoiceState.Playing && this.state !== VoiceState.Released) return;

    for (let i = 0; i < blockSize; i++) {
      const envValue = this.ampEnvelope.process();
      
      if (!this.ampEnvelope.isActive()) {
        this.state = VoiceState.CleanUp;
        break;
      }

      // Apply envelope to gain
      if (this.gainNode) {
        const currentTime = this.context.currentTime + (i / this.context.sampleRate);
        this.gainNode.gain.setValueAtTime(envValue * this.crossfadeGain, currentTime);
      }
    }

    this.age += blockSize;
  }

  handleNoteOff(noteNumber: number) {
    console.log(`🔴 Voice.handleNoteOff: ${noteNumber}, myNote=${this.triggerEvent?.note}, isNoteOff=${this.isNoteOff}, state=${this.state}`);
    
    // Only handle note-off if this voice matches the note and hasn't already been released
    if (this.triggerEvent?.note !== noteNumber || this.isNoteOff || this.state !== VoiceState.Playing) {
      return;
    }
    
    this.isNoteOff = true;
    console.log(`📊 Starting envelope release for note ${noteNumber}, loop_mode=${this.region?.loop_mode}`);
    
    // Handle different loop modes
    if (this.region?.loop_mode === 'loop_sustain') {
      console.log('🔄 Sustain loop: stopping loop, allowing tail-off');
      if (this.source) {
        this.source.loop = false;
      }
    } else if (this.region?.loop_mode === 'loop_continuous') {
      console.log('🔄 Continuous loop: triggering release');
    }
    
    // Always trigger envelope release for proper tail-off
    this.ampEnvelope.startRelease();
    this.state = VoiceState.Released;
  }

  stop() {
    if (this.source) {
      try {
        this.source.stop();
      } catch (e) {
        // Source may already be stopped
      }
      this.source.disconnect();
      this.source = null;
    }
    if (this.outputNode && this.outputNode !== this.gainNode) {
      this.outputNode.disconnect();
    }
    this.state = VoiceState.Idle;
  }

  isActive(): boolean {
    return this.state === VoiceState.Playing || this.state === VoiceState.Released;
  }

  isFree(): boolean {
    return this.state === VoiceState.Idle;
  }

  shouldCleanUp(): boolean {
    return this.state === VoiceState.CleanUp;
  }

  getAge(): number {
    return this.age;
  }

  getTriggerEvent(): AudioControlEvent | null {
    return this.triggerEvent;
  }
}
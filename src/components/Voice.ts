import { ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';
import { AudioControlEvent } from '../types/audio';
import { SFZEngine } from './SFZEngine';

export enum VoiceState {
  Idle,
  Playing,
  Released,
  CleanUp
}

export enum EnvelopeStage {
  Delay = 'delay',
  Attack = 'attack',
  Hold = 'hold',
  Decay = 'decay',
  Sustain = 'sustain',
  Release = 'release',
  Fadeout = 'fadeout',
  Done = 'done',
  Idle = 'idle'
}

export class ADSREnvelope {
  private sampleRate: number;
  private desc: any;
  private dynamic: boolean = false;
  private triggerVelocity: number = 0;
  private midiState: any;
  
  // Envelope parameters
  private delay: number = 0;
  private attackStep: number = 0;
  private decayRate: number = 0;
  private releaseRate: number = 0;
  private hold: number = 0;
  private sustain: number = 1;
  private start: number = 0;
  private sustainThreshold: number = 0;
  
  // State variables
  private currentState: EnvelopeStage = EnvelopeStage.Idle;
  private currentValue: number = 0;
  private shouldRelease: boolean = false;
  private releaseDelay: number = 0;
  private transitionDelta: number = 0;
  private freeRunning: boolean = false;
  
  // Constants from C++ implementation
  private readonly OFF_TIME: number = 0.03;
  private readonly SUSTAIN_FREE_RUNNING_THRESHOLD: number = 0.001;
  private readonly VIRTUALLY_ZERO: number = 0.00001;
  private readonly EG_RELEASE_THRESHOLD: number = 0.0001;
  private readonly EG_TRANSITION_TIME: number = 0.001;

  constructor(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  reset(desc: any, region: any, delay: number, velocity: number): void {
    this.desc = desc;
    this.dynamic = desc?.dynamic || false;
    this.triggerVelocity = velocity;
    this.currentState = EnvelopeStage.Delay;
    
    this.updateValues(delay);
    this.releaseDelay = 0;
    this.shouldRelease = false;
    this.freeRunning = (
      (this.sustain <= this.SUSTAIN_FREE_RUNNING_THRESHOLD) ||
      (region.loop_mode === 'one_shot' && region.isOscillator)
    );
    this.currentValue = this.start;
  }

  updateValues(delay: number): void {
    if (this.currentState === EnvelopeStage.Delay) {
      this.delay = delay + this.secondsToSamples(this.getDelay());
    }
    
    this.attackStep = this.secondsToLinRate(this.getAttack());
    this.decayRate = this.secondsToExpRate(this.getDecay());
    this.releaseRate = this.secondsToExpRate(this.getRelease());
    this.hold = this.secondsToSamples(this.getHold());
    this.sustain = Math.max(0, Math.min(1, this.getSustain()));
    this.start = Math.max(0, Math.min(1, this.getStart()));
    this.sustainThreshold = this.sustain + this.VIRTUALLY_ZERO;
  }

  private secondsToSamples(timeInSeconds: number): number {
    if (timeInSeconds <= 0) return 0;
    return Math.floor(timeInSeconds * this.sampleRate);
  }

  private secondsToLinRate(timeInSeconds: number): number {
    if (timeInSeconds <= 0) return 1;
    return 1 / (this.sampleRate * timeInSeconds);
  }

  private secondsToExpRate(timeInSeconds: number): number {
    if (timeInSeconds <= 0) return 0.0;
    
    timeInSeconds = Math.max(this.OFF_TIME, timeInSeconds);
    return Math.exp(-9.0 / (timeInSeconds * this.sampleRate));
  }

  getBlock(output: Float32Array): void {
    if (this.dynamic) {
      let processed = 0;
      let remaining = output.length;
      while (remaining > 0) {
        const chunkSize = Math.min(128, remaining); // processChunkSize equivalent
        this.updateValues(processed);
        this.getBlockInternal(output.subarray(processed, processed + chunkSize));
        processed += chunkSize;
        remaining -= chunkSize;
      }
    } else {
      this.getBlockInternal(output);
    }
  }

  private getBlockInternal(output: Float32Array): void {
    let currentState = this.currentState;
    let currentValue = this.currentValue;
    let shouldRelease = this.shouldRelease;
    let releaseDelay = this.releaseDelay;
    let transitionDelta = this.transitionDelta;

    let index = 0;
    while (index < output.length) {
      if (shouldRelease && releaseDelay === 0) {
        currentState = EnvelopeStage.Release;
        releaseDelay = -1;
      } else if (shouldRelease && releaseDelay > 0) {
        const remaining = output.length - index;
        const chunkSize = Math.min(remaining, releaseDelay);
        // Process chunk without release
        for (let i = 0; i < chunkSize; i++) {
          output[index++] = this.processSample(currentState, currentValue, shouldRelease, releaseDelay, transitionDelta);
        }
        releaseDelay -= chunkSize;
        continue;
      }

      // Process samples for current state
      const remaining = output.length - index;
      const chunkSize = Math.min(remaining, 128); // processChunkSize equivalent
      
      for (let i = 0; i < chunkSize; i++) {
        const result = this.processSample(currentState, currentValue, shouldRelease, releaseDelay, transitionDelta);
        output[index++] = result;
        currentValue = result;
        
        // Update state based on current value and stage
        currentState = this.updateState(currentState, currentValue, shouldRelease);
      }
    }

    this.currentState = currentState;
    this.currentValue = currentValue;
    this.shouldRelease = shouldRelease;
    this.releaseDelay = releaseDelay;
    this.transitionDelta = transitionDelta;
  }

  private processSample(currentState: EnvelopeStage, currentValue: number, shouldRelease: boolean, releaseDelay: number, transitionDelta: number): number {
    switch (currentState) {
      case EnvelopeStage.Delay:
        if (this.delay > 0) {
          this.delay--;
          return this.start;
        } else {
          return 1; // Attack starts at 1
        }

      case EnvelopeStage.Attack:
        currentValue += this.attackStep;
        if (currentValue >= 1) {
          currentValue = 1;
        }
        return currentValue;

      case EnvelopeStage.Hold:
        if (this.hold > 0) {
          this.hold--;
          return currentValue;
        } else {
          return currentValue; // Will transition to decay
        }

      case EnvelopeStage.Decay:
        currentValue *= this.decayRate;
        if (currentValue <= this.sustainThreshold) {
          currentValue = Math.max(this.sustain, currentValue);
          transitionDelta = (this.sustain - currentValue) / (this.sampleRate * this.EG_TRANSITION_TIME);
        }
        return currentValue;

      case EnvelopeStage.Sustain:
        if (!shouldRelease && this.freeRunning) {
          shouldRelease = true;
        }
        if (currentValue > this.sustain) {
          currentValue += transitionDelta;
        }
        return currentValue;

      case EnvelopeStage.Release:
        const previousValue = currentValue;
        currentValue *= this.releaseRate;
        if (currentValue <= this.EG_RELEASE_THRESHOLD) {
          currentState = EnvelopeStage.Fadeout;
          currentValue = previousValue;
          transitionDelta = -Math.max(this.EG_RELEASE_THRESHOLD, currentValue) / (this.sampleRate * this.EG_TRANSITION_TIME);
        }
        return previousValue;

      case EnvelopeStage.Fadeout:
        currentValue += transitionDelta;
        if (currentValue <= 0) {
          currentState = EnvelopeStage.Done;
          currentValue = 0;
        }
        return currentValue;

      default:
        return 0;
    }
  }

  private updateState(currentState: EnvelopeStage, currentValue: number, shouldRelease: boolean): EnvelopeStage {
    switch (currentState) {
      case EnvelopeStage.Delay:
        if (this.delay <= 0) {
          return EnvelopeStage.Attack;
        }
        break;

      case EnvelopeStage.Attack:
        if (currentValue >= 1) {
          return EnvelopeStage.Hold;
        }
        break;

      case EnvelopeStage.Hold:
        if (this.hold <= 0) {
          return EnvelopeStage.Decay;
        }
        break;

      case EnvelopeStage.Decay:
        if (currentValue <= this.sustainThreshold) {
          return EnvelopeStage.Sustain;
        }
        break;

      case EnvelopeStage.Release:
        if (currentValue <= this.EG_RELEASE_THRESHOLD) {
          return EnvelopeStage.Fadeout;
        }
        break;

      case EnvelopeStage.Fadeout:
        if (currentValue <= 0) {
          return EnvelopeStage.Done;
        }
        break;
    }
    return currentState;
  }

  startRelease(releaseDelay: number = 0): void {
    this.shouldRelease = true;
    this.releaseDelay = releaseDelay;
  }

  cancelRelease(delay: number): void {
    this.currentState = EnvelopeStage.Sustain;
    this.shouldRelease = false;
    this.releaseDelay = -1;
  }

  setReleaseTime(timeInSeconds: number): void {
    this.releaseRate = this.secondsToExpRate(timeInSeconds);
  }

  isActive(): boolean {
    return this.currentState !== EnvelopeStage.Idle && this.currentState !== EnvelopeStage.Done;
  }

  isReleased(): boolean {
    return this.currentState === EnvelopeStage.Release || 
           this.currentState === EnvelopeStage.Fadeout || 
           this.currentState === EnvelopeStage.Done;
  }

  /**
   * Process a single sample - maintains compatibility with existing Voice class
   */
  process(): number {
    const output = new Float32Array(1);
    this.getBlock(output);
    return output[0];
  }

  // Helper methods to get envelope parameters (simplified for now)
  private getDelay(): number { return this.desc?.delay || 0; }
  private getAttack(): number { return this.desc?.attack || 0.001; }
  private getDecay(): number { return this.desc?.decay || 0.001; }
  private getRelease(): number { return this.desc?.release || 1.0; }
  private getHold(): number { return this.desc?.hold || 0; }
  private getSustain(): number { return this.desc?.sustain !== undefined ? this.desc.sustain : 1; }
  private getStart(): number { return this.desc?.start || 0; }
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
  private sustainState: 'Up' | 'Sustaining' = 'Up';

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
    
    // Check if the note was already released before the voice was created
    // This can happen with async voice triggering where note-off is processed before voice creation
    if (event.velocity === 0) {
      console.log(`🎵 Voice.startVoice: note already released, will trigger immediate release after voice starts`);
      this.isNoteOff = true;
    }

    // Setup envelope from region with proper defaults
    const attack = Math.max(0.001, (region.ampeg_attack || 0) / 1000);
    const decay = Math.max(0.001, (region.ampeg_decay || 0) / 1000);
    const sustain = region.ampeg_sustain !== undefined ? Math.max(0, Math.min(1, region.ampeg_sustain)) : 1;
    const release = Math.max(0.1, (region.ampeg_release || 1000) / 1000);
    
    console.log(`📊 Envelope: A=${attack}s, D=${decay}s, S=${sustain}, R=${release}s`);
    
    // Create envelope description for the new implementation
    const envelopeDesc = {
      attack,
      decay,
      sustain,
      release,
      dynamic: false
    };
    
    this.ampEnvelope.reset(envelopeDesc, region, 0, event.velocity);
    console.log('🚀 Voice started successfully');
    
    // If the note was already released, immediately trigger release
    if (this.isNoteOff) {
      console.log(`🎵 Voice.startVoice: triggering immediate release for already released note`);
      this.ampEnvelope.startRelease();
      this.state = VoiceState.Released;
    }
    
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
    // Only process if voice is active
    if (this.state !== VoiceState.Playing && this.state !== VoiceState.Released) {
      return;
    }

    // Process envelope block for better performance and accuracy
    const envelopeBlock = new Float32Array(blockSize);
    this.ampEnvelope.getBlock(envelopeBlock);
    
    // Check if envelope is finished
    if (!this.ampEnvelope.isActive()) {
      console.log('📊 Envelope finished, cleaning up voice');
      // For loop_continuous voices, stop the loop when envelope is done
      if (this.region?.loop_mode === 'loop_continuous' && this.source) {
        console.log('📊 Loop continuous: envelope finished, stopping loop');
        this.source.loop = false;
      }
      this.state = VoiceState.CleanUp;
      return;
    }

    // For loop_continuous voices, stop the loop when envelope enters Release stage
    if (this.region?.loop_mode === 'loop_continuous' && this.source && this.ampEnvelope.isReleased()) {
      console.log('📊 Loop continuous: envelope in Release stage, stopping loop');
      this.source.loop = false;
    }

    // Apply envelope to gain using exponential smoothing for better audio quality
    if (this.gainNode) {
      // Get the final envelope value for this block
      const finalEnvValue = envelopeBlock[blockSize - 1] * this.crossfadeGain;
      
      // Apply the final envelope value to the gain node
      this.gainNode.gain.setValueAtTime(finalEnvValue, this.context.currentTime);
      
      // Only log when envelope value changes significantly or when in Release stage
      if (finalEnvValue < 0.95 || this.ampEnvelope.isReleased()) {
        console.log(`🔊 Envelope applied: final=${finalEnvValue.toFixed(3)}, crossfade=${this.crossfadeGain}`);
      }
    }

    this.age += blockSize;
  }

  handleNoteOff(noteNumber: number) {
    console.log(`🔴 Voice.handleNoteOff: ${noteNumber}, myNote=${this.triggerEvent?.note}, isNoteOff=${this.isNoteOff}, state=${this.state}`);
    
    // Only handle note-off if this voice matches the note and hasn't already been released
    if (this.triggerEvent?.note !== noteNumber) {
      console.log(`🔴 Voice.handleNoteOff: note mismatch, myNote=${this.triggerEvent?.note}, target=${noteNumber}`);
      return;
    }
    
    if (this.isNoteOff) {
      console.log(`🔴 Voice.handleNoteOff: already released`);
      return;
    }
    
    if (this.state !== VoiceState.Playing) {
      console.log(`🔴 Voice.handleNoteOff: not playing, state=${this.state}`);
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
      console.log('🔄 Continuous loop: triggering release (will stop loop after envelope completes)');
      // For loop_continuous, we don't stop the loop immediately
      // The envelope release will handle the fade-out, then we'll stop the loop
    }
    
    // Always trigger envelope release for proper tail-off
    this.ampEnvelope.startRelease();
    this.state = VoiceState.Released;
    console.log(`📊 Voice state set to Released`);
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

  /**
   * Handle sustain pedal release - trigger release for sustaining voices
   */
  handleSustainRelease() {
    if (this.state === VoiceState.Playing && this.region?.loop_mode === 'loop_sustain') {
      console.log(`📊 Sustain pedal release: stopping loop for note ${this.triggerEvent?.note}`);
      if (this.source) {
        this.source.loop = false;
      }
      this.ampEnvelope.startRelease();
      this.state = VoiceState.Released;
    }
  }

  /**
   * Register CC event - handle sustain pedal release
   */
  registerCC(delay: number, ccNumber: number, ccValue: number) {
    if (!this.region || this.state !== VoiceState.Playing) {
      return;
    }

    // Handle sustain pedal (CC64)
    if (ccNumber === 64) {
      const sustainThreshold = this.region.sustain_threshold || 64;
      const sustainPressed = ccValue >= sustainThreshold;
      
      if (!sustainPressed && this.sustainState === 'Sustaining') {
        this.sustainState = 'Up';
        
        // Check if note is off and loop mode is not one_shot
        if (this.isNoteOff && this.region.loop_mode !== 'one_shot') {
          console.log(`📊 Sustain pedal release: triggering release for note ${this.triggerEvent?.note}`);
          this.ampEnvelope.startRelease();
          this.state = VoiceState.Released;
        }
      } else if (sustainPressed) {
        this.sustainState = 'Sustaining';
      }
    }
  }
}
import { ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';

export class SFZEngine {
  private context: AudioContext;
  private sampleRate: number;

  constructor(context: AudioContext) {
    this.context = context;
    this.sampleRate = context.sampleRate;
  }

  /**
   * Process SFZ opcodes and apply them to the audio processing chain
   */
  processRegion(region: ParseOpcodeObj, source: AudioBufferSourceNode, output: AudioNode): AudioNode {
    let currentNode: AudioNode = source;

    // Apply filters
    currentNode = this.applyFilters(region, currentNode);

    // Apply amplitude envelope and modulation
    currentNode = this.applyAmplitudeProcessing(region, currentNode);

    // Apply panning
    currentNode = this.applyPanning(region, currentNode);

    return currentNode;
  }

  private applyFilters(region: ParseOpcodeObj, input: AudioNode): AudioNode {
    let currentNode = input;

    // Low-pass filter
    if (region.cutoff || region.fil_type === 'lpf_1p' || region.fil_type === 'lpf_2p') {
      const filter = this.context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = region.cutoff || 20000;
      filter.Q.value = region.resonance || 0;
      
      currentNode.connect(filter);
      currentNode = filter;
    }

    // High-pass filter
    if (region.fil_type === 'hpf_1p' || region.fil_type === 'hpf_2p') {
      const filter = this.context.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = region.cutoff || 20;
      filter.Q.value = region.resonance || 0;
      
      currentNode.connect(filter);
      currentNode = filter;
    }

    // Band-pass filter
    if (region.fil_type === 'bpf_1p' || region.fil_type === 'bpf_2p') {
      const filter = this.context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = region.cutoff || 1000;
      filter.Q.value = region.resonance || 1;
      
      currentNode.connect(filter);
      currentNode = filter;
    }

    return currentNode;
  }

  private applyAmplitudeProcessing(region: ParseOpcodeObj, input: AudioNode): AudioNode {
    const gainNode = this.context.createGain();
    
    // Base volume/amplitude
    let baseGain = 1.0;
    if (region.volume !== undefined) {
      baseGain *= this.dbToLinear(region.volume);
    }
    if (region.amplitude !== undefined) {
      baseGain *= region.amplitude;
    }
    
    gainNode.gain.value = baseGain;
    
    input.connect(gainNode);
    return gainNode;
  }

  private applyPanning(region: ParseOpcodeObj, input: AudioNode): AudioNode {
    if (region.pan !== undefined && region.pan !== 0) {
      const panNode = this.context.createStereoPanner();
      panNode.pan.value = Math.max(-1, Math.min(1, region.pan / 100));
      
      input.connect(panNode);
      return panNode;
    }
    
    return input;
  }

  /**
   * Calculate crossfade values based on velocity, key, or CC
   */
  calculateCrossfade(region: ParseOpcodeObj, velocity: number, key: number): number {
    let xfade = 1.0;

    // Velocity crossfade
    if (region.xfin_lovel !== undefined && region.xfin_hivel !== undefined) {
      if (velocity >= region.xfin_lovel && velocity <= region.xfin_hivel) {
        const range = region.xfin_hivel - region.xfin_lovel;
        xfade *= range > 0 ? (velocity - region.xfin_lovel) / range : 1;
      } else if (velocity < region.xfin_lovel) {
        xfade = 0;
      }
    }

    if (region.xfout_lovel !== undefined && region.xfout_hivel !== undefined) {
      if (velocity >= region.xfout_lovel && velocity <= region.xfout_hivel) {
        const range = region.xfout_hivel - region.xfout_lovel;
        xfade *= range > 0 ? 1 - (velocity - region.xfout_lovel) / range : 0;
      } else if (velocity > region.xfout_hivel) {
        xfade = 0;
      }
    }

    // Key crossfade
    if (region.xfin_lokey !== undefined && region.xfin_hikey !== undefined) {
      if (key >= region.xfin_lokey && key <= region.xfin_hikey) {
        const range = region.xfin_hikey - region.xfin_lokey;
        xfade *= range > 0 ? (key - region.xfin_lokey) / range : 1;
      } else if (key < region.xfin_lokey) {
        xfade = 0;
      }
    }

    if (region.xfout_lokey !== undefined && region.xfout_hikey !== undefined) {
      if (key >= region.xfout_lokey && key <= region.xfout_hikey) {
        const range = region.xfout_hikey - region.xfout_lokey;
        xfade *= range > 0 ? 1 - (key - region.xfout_lokey) / range : 0;
      } else if (key > region.xfout_hikey) {
        xfade = 0;
      }
    }

    return Math.max(0, Math.min(1, xfade));
  }

  /**
   * Calculate sample offset based on region parameters
   */
  calculateSampleOffset(region: ParseOpcodeObj): number {
    let offset = region.offset || 0;
    
    // Add random offset if specified
    if (region.offset_random) {
      offset += Math.random() * region.offset_random;
    }

    return Math.max(0, Math.floor(offset));
  }

  /**
   * Calculate sample end position
   */
  calculateSampleEnd(region: ParseOpcodeObj, sampleLength: number): number {
    if (region.end !== undefined) {
      return Math.min(region.end, sampleLength);
    }
    return sampleLength;
  }

  /**
   * Setup loop parameters for AudioBufferSourceNode
   */
  setupLooping(region: ParseOpcodeObj, source: AudioBufferSourceNode, sampleRate: number) {
    const loopMode = region.loop_mode;
    
    if (loopMode === 'loop_continuous' || loopMode === 'loop_sustain') {
      source.loop = true;
      
      const loopStart = region.loop_start || 0;
      const loopEnd = region.loop_end || source.buffer?.length || 0;
      
      source.loopStart = loopStart / sampleRate;
      source.loopEnd = loopEnd / sampleRate;
    } else {
      source.loop = false;
    }
  }

  /**
   * Get S-curve for smooth crossfading (matches C++ implementation)
   */
  private getScurve(): Float32Array {
    const N = 1024;
    const curve = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1);
      curve[i] = (1.0 - Math.cos(Math.PI * x)) * 0.5;
    }
    return curve;
  }

  /**
   * Apply loop crossfading for smooth transitions
   */
  applyLoopCrossfade(buffer: Float32Array, loopStart: number, loopEnd: number, crossfadeSize: number): void {
    if (crossfadeSize <= 0 || loopStart >= loopEnd) return;

    const curve = this.getScurve();
    const actualCrossfade = Math.min(crossfadeSize, loopEnd - loopStart);
    
    // Apply crossfade at loop end (fade out)
    const fadeOutStart = Math.max(0, loopEnd - actualCrossfade);
    for (let i = fadeOutStart; i < loopEnd && i < buffer.length; i++) {
      const pos = (i - fadeOutStart) / actualCrossfade;
      const curveIndex = Math.min(Math.floor(pos * (curve.length - 1)), curve.length - 1);
      const fadeValue = 1.0 - curve[curveIndex];
      buffer[i] *= fadeValue;
    }

    // Apply crossfade at loop start (fade in)
    const fadeInEnd = Math.min(buffer.length, loopStart + actualCrossfade);
    for (let i = loopStart; i < fadeInEnd; i++) {
      const pos = (i - loopStart) / actualCrossfade;
      const curveIndex = Math.min(Math.floor(pos * (curve.length - 1)), curve.length - 1);
      const fadeValue = curve[curveIndex];
      buffer[i] *= fadeValue;
    }
  }

  /**
   * Process loop crossfading with proper state management
   */
  processLoopCrossfade(region: ParseOpcodeObj, buffer: Float32Array, sourcePosition: number, playbackRate: number): void {
    const loopMode = region.loop_mode;
    if (loopMode !== 'loop_continuous' && loopMode !== 'loop_sustain') return;

    const loopStart = region.loop_start || 0;
    const loopEnd = region.loop_end || buffer.length;
    const crossfadeSize = region.loop_crossfade || 0;

    if (crossfadeSize > 0) {
      // Calculate effective loop boundaries considering playback rate
      const effectiveLoopStart = Math.floor(loopStart * playbackRate);
      const effectiveLoopEnd = Math.floor(loopEnd * playbackRate);
      
      this.applyLoopCrossfade(buffer, effectiveLoopStart, effectiveLoopEnd, crossfadeSize);
    }
  }

  /**
   * Calculate pitch modulation from various sources
   */
  calculatePitchModulation(region: ParseOpcodeObj, note: number, velocity: number, bend: number = 0): number {
    let pitchCents = 0;

    // Pitch keytrack
    const keycenter = region.pitch_keycenter || note;
    const keytrack = region.pitch_keytrack !== undefined ? region.pitch_keytrack : 1;
    pitchCents += (note - keycenter) * keytrack * 100;

    // Transpose and tune
    pitchCents += (region.transpose || 0) * 100;
    pitchCents += region.tune || 0;

    // Pitch bend
    const bendUp = region.bend_up || 200;
    const bendDown = region.bend_down || -200;
    if (bend > 0) {
      pitchCents += (bend / 8192) * bendUp;
    } else {
      pitchCents += (bend / 8192) * Math.abs(bendDown);
    }

    // Velocity tracking
    if (region.pitch_veltrack) {
      pitchCents += (velocity - 0.5) * region.pitch_veltrack * 100;
    }

    return pitchCents;
  }

  /**
   * Convert decibels to linear gain
   */
  private dbToLinear(db: number): number {
    return Math.pow(10, db / 20);
  }

  /**
   * Convert cents to frequency ratio
   */
  centsToRatio(cents: number): number {
    return Math.pow(2, cents / 1200);
  }
}
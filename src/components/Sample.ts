import { ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';
import { AudioControlEvent } from '../types/audio';

class Sample {
  private context: AudioContext;
  private region: ParseOpcodeObj;
  private source: AudioBufferSourceNode;
  private sampleRate: number = 48000;
  private sampleDefaults: any = {
    bend_down: -200,
    bend_up: 200,
    pitch_keycenter: 0,
    pitch_keytrack: 0,
    tune: 0,
    transpose: 0,
    velocity: 0,
    veltrack: 0,
  };

  constructor(context: AudioContext, buffer: AudioBuffer, region: ParseOpcodeObj) {
    this.context = context;
    this.region = Object.assign({}, this.sampleDefaults, region);
    this.source = this.context.createBufferSource();
    this.source.buffer = buffer;
    this.source.connect(this.context.destination);
  }

  getCents(note: number, bend: number) {
    const pitch: number = (note - this.region.pitch_keycenter) * this.region.pitch_keytrack + this.region.tune;
    let cents: number = pitch + (this.region.veltrack * this.region.velocity) / 127;
    if (bend < 0) {
      cents += (-8192 * bend) / this.region.bend_down;
    } else {
      cents += (8192 * bend) / this.region.bend_up;
    }
    return Math.pow(Math.pow(2, 1 / 1200), cents);
  }

  pitchToFreq(pitch: number) {
    return Math.pow(2, (pitch - 69) / 12.0) * 440;
  }

  setPlaybackRate(event: AudioControlEvent, bend = 0) {
    if (!this.region.pitch_keycenter) this.region.pitch_keycenter = event.note;
    const cents: number = this.getCents(event.note, bend);
    const frequency: number = this.pitchToFreq(event.note + this.region.transpose) * cents;
    const rate: number = frequency / this.pitchToFreq(this.region.pitch_keycenter);
    console.log('playbackRate', rate);
    this.source.playbackRate.value = rate;
  }

  play() {
    if (this.region.offset && this.region.end) {
      const offset: number = Number(this.region.offset) / this.sampleRate;
      const end: number = Number(this.region.end) / this.sampleRate;
      const duration: number = end - offset;
      this.source.start(0, offset, duration);
    } else {
      this.source.start(0);
    }
  }

  stop() {
    this.source.stop();
  }
}

export default Sample;

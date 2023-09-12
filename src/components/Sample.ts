import { AudioSfzOpcodeObj } from '../types/audio';

class Sample {
  private context: AudioContext;
  private region: AudioSfzOpcodeObj;
  private source: AudioBufferSourceNode;
  private sampleRate: number = 48000;

  constructor(context: AudioContext, buffer: AudioBuffer, region: AudioSfzOpcodeObj) {
    this.context = context;
    this.region = region;
    this.source = this.context.createBufferSource();
    this.source.buffer = buffer;
    this.source.connect(this.context.destination);
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

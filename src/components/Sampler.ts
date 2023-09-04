class Sampler {
  private context: AudioContext;
  private source: AudioBufferSourceNode;

  constructor() {
    if (!window.AudioContext) window.alert('Browser does not support WebAudio');
    this.context = new window.AudioContext();
    this.source = this.context.createBufferSource();
  }

  play(buffer: AudioBuffer) {
    console.log('play', buffer);
    this.source = this.context.createBufferSource();
    this.source.buffer = buffer;
    this.source.connect(this.context.destination);
    this.source.start(0);
  }

  stop() {
    this.source.stop();
  }
}

export default Sampler;

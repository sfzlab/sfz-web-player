declare global {
  interface Window {
    WebAudioTinySynth: any;
    WebAudioControlsOptions: any;
    webAudioControlsWidgetManager: any;
  }
}

interface AudioControlEvent {
  channel: number;
  note: number;
  velocity: number;
}

interface AudioTinySynth {
  send(arg: number[]): null;
}

export { AudioControlEvent, AudioTinySynth };

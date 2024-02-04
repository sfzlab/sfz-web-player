declare global {
  interface Window {
    WebAudioControlsOptions: any;
    webAudioControlsWidgetManager: any;
  }
}

interface AudioControlEvent {
  channel: number;
  note: number;
  velocity: number;
}

interface AudioKeyboardMap {
  [name: number]: boolean;
}

export { AudioControlEvent, AudioKeyboardMap };

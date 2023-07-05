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

interface AudioKeys {
  [key: number]: AudioSample[];
}

interface AudioSample {
  ampeg_release?: number;
  hikey: number;
  lokey: number;
  key: number;
  pitch_keycenter: number;
  region: AudioSfzRegion[];
  sample: string;
  seq_position: number;
  seq_length: number;
  tune: number;
  volume: number;
}

interface AudioSfz {
  control: AudioSfzOpcodes[];
  global: AudioSfzOpcodes[];
  group: AudioSfzOpcodes[];
  master: AudioSfzOpcodes[];
}

interface AudioSfzOpcodes {
  opcode: AudioSfzOpcode[];
}

interface AudioSfzOpcode {
  name: string;
  value: string;
}

interface AudioSfzOpcodeObj {
  [name: string]: string | number;
}

interface AudioSfzRegion {
  sample: string;
  seq_position: number;
}

interface AudioSfzVariables {
  [name: string]: string;
}

export {
  AudioControlEvent,
  AudioKeys,
  AudioSample,
  AudioSfz,
  AudioSfzOpcodes,
  AudioSfzOpcode,
  AudioSfzOpcodeObj,
  AudioSfzVariables,
};

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
  end: number;
  hikey: number;
  lokey: number;
  key: number;
  offset: number;
  pitch_keycenter: number;
  region: AudioRegion[];
  sample: string;
  seq_position: number;
  seq_length: number;
  tune: number;
  volume: number;
  modified: boolean;
}

enum AudioOpcodes {
  region = 'region',
  group = 'group',
  control = 'control',
  global = 'global',
  curve = 'curve',
  effect = 'effect',
  master = 'master',
  midi = 'midi',
  sample = 'sample',
}

interface AudioSfzHeader {
  elements: AudioSfzOpcode[];
  name: AudioOpcodes;
  type: 'element';
}

interface AudioSfzOpcode {
  attributes: AudioSfzAttribute;
  name: 'opcode';
  type: 'element';
}

interface AudioSfzAttribute {
  name: string;
  value: string;
}

interface AudioSfzOpcodeObj {
  [name: string]: string | number;
}

interface AudioRegion {
  sample: string;
  seq_position: number;
}

interface AudioSfzVariables {
  [name: string]: string;
}

export {
  AudioControlEvent,
  AudioKeys,
  AudioOpcodes,
  AudioSample,
  AudioSfzAttribute,
  AudioSfzHeader,
  AudioSfzOpcode,
  AudioSfzOpcodeObj,
  AudioSfzVariables,
};

import {
  AudioControlEvent,
  AudioKeys,
  AudioOpcodes,
  AudioSample,
  AudioSfzHeader,
  AudioSfzOpcodeObj,
} from '../types/audio';
import { AudioOptions } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import { flattenSfzObject, opcodesToObject, parseSfz, setParserLoader } from '../utils/parser';
import { pathDir, pathJoin } from '../utils/utils';
import { pathSubDir } from '../utils/utils';

const PRELOAD: boolean = true;

class Audio extends Event {
  loader: FileLoader;
  private audio: AudioContext | undefined;
  private audioBuffer: AudioBufferSourceNode | undefined;
  private keys: AudioKeys = [];

  constructor(options: AudioOptions) {
    super();
    if (window.AudioContext) {
      this.audio = new window.AudioContext();
      this.audioBuffer = this.audio.createBufferSource();
    }
    if (window.webAudioControlsWidgetManager) {
      window.webAudioControlsWidgetManager.addMidiListener((event: any) => this.onKeyboard(event));
    } else {
      console.log('webaudio-controls not found, add to a <script> tag.');
    }

    if (options.loader) {
      this.loader = options.loader;
    } else {
      this.loader = new FileLoader();
    }
    setParserLoader(this.loader);
    if (options.root) this.loader.setRoot(options.root);
    if (options.file) {
      const file: FileLocal | FileRemote | undefined = this.loader.addFile(options.file);
      this.showFile(file);
    }
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    this.dispatchEvent('preload', {
      status: `Loading sfz files`,
    });
    this.dispatchEvent('loading', true);
    file = await this.loader.getFile(file);
    if (!file) return;
    console.log('showFile', file);
    const prefix: string = pathDir(file.path);
    console.log('prefix', prefix);
    const headers: AudioSfzHeader[] = await parseSfz(prefix, file?.contents);
    console.log('headers', headers);
    const sfzFlat: any = flattenSfzObject(headers);
    console.log('sfzFlat', sfzFlat);
    this.keys = sfzFlat;

    // if file contains default path
    let defaultPath: string = '';
    headers.forEach((header: AudioSfzHeader) => {
      if (header.name === AudioOpcodes.control) {
        const controlObj: AudioSfzOpcodeObj = opcodesToObject(header.elements);
        if (controlObj.default_path) {
          defaultPath = controlObj.default_path as string;
          console.log('defaultPath', defaultPath);
        }
      }
    });

    const rootPath: string = pathSubDir(pathDir(file.path), this.loader.root);
    for (const key in this.keys) {
      for (const i in this.keys[key]) {
        let samplePath: string = this.keys[key][i].sample;
        // Temporary fix for recurring samples.
        if (this.keys[key][i].modified) continue;
        if (!samplePath || samplePath.startsWith('https')) continue;
        if (file.path.startsWith('https')) {
          samplePath = pathJoin(pathDir(file.path), defaultPath, samplePath);
        } else if (!samplePath.startsWith(rootPath)) {
          samplePath = pathJoin(rootPath, defaultPath, samplePath);
        }
        this.keys[key][i].sample = samplePath;
        this.keys[key][i].modified = true;
      }
    }

    // Quick test using https://github.com/kmturley/sfz.js

    const SfzLib = require('../lib/sfz');
    console.log('SfzLib', SfzLib);

    const instrumentDefinition = sfzFlat;
    instrumentDefinition.type = "Instrument";
    if (SfzLib.WebAudioSynth) instrumentDefinition.driver = SfzLib.WebAudioSynth;
    if (this.audio) instrumentDefinition.audioContext = this.audio;
    console.log('instrumentDefinition', instrumentDefinition);

    const instrument = new SfzLib.Instrument(instrumentDefinition);
    console.log('instrument', instrument);

    this.dispatchEvent('loading', false);
  }

  onKeyboard(event: any) {
    const controlEvent: AudioControlEvent = {
      channel: 0x90,
      note: event.data[1],
      velocity: event.data[0] === 128 ? 0 : event.data[2],
    };
    this.setSynth(controlEvent);
    this.dispatchEvent('change', controlEvent);
  }

  async setSynth(event: AudioControlEvent) {
    // prototype using samples
    if (event.velocity === 0) {
      // this.audioBuffer.stop();
      return;
    }
    if (!this.keys[event.note]) return;
    const keySamples: AudioSample[] = this.keys[event.note];
    const randomSample: number = Math.floor(Math.random() * keySamples.length);
    const keySample: AudioSample = keySamples[0];
    if (keySample.sample.includes('*')) return;
    console.log('sample', event.note, randomSample, keySample);
    const fileRef: FileLocal | FileRemote | undefined = this.loader.files[keySample.sample];
    const newFile: FileLocal | FileRemote | undefined = await this.loader.getFile(fileRef || keySample.sample, true);
    if (this.audio) {
      this.audioBuffer = this.audio.createBufferSource();
      this.audioBuffer.buffer = newFile?.contents;
      this.audioBuffer.connect(this.audio.destination);
      this.audioBuffer.start(0);
    }
  }

  reset() {
    this.audioBuffer?.stop();
    this.keys = [];
  }
}

export default Audio;

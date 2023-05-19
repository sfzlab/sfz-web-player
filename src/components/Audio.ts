import { AudioControlEvent } from '../types/audio';
import { AudioOptions } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import { parseSfz, setParserLoader } from '../utils/parser';
import { pathDir } from '../utils/utils';

class Audio extends Event {
  loader: FileLoader;
  private audio: AudioContext | undefined;
  private audioBuffer: AudioBufferSourceNode | undefined;
  private samples: { [key: number]: string } = [];

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

  async loadSample(path: string) {
    const fileRef: FileLocal | FileRemote | undefined = this.loader.files[path];
    if (fileRef) {
      return await this.loader.getFile(fileRef, true);
    }
    const file: FileLocal | FileRemote | undefined = this.loader.addFile(path);
    return this.loader.getFile(file, true);
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    this.dispatchEvent('loading', true);
    file = await this.loader.getFile(file);
    if (!file) return;
    console.log('showFile', file);
    const prefix: string = pathDir(file.path);
    console.log('prefix', prefix);
    const sfzObject: any = await parseSfz(prefix, file?.contents);
    console.log('sfzObject', sfzObject);

    // hardcoded prototype for one sfz file
    let defaultPath: string = '';
    if (sfzObject.control && sfzObject.control[0] && sfzObject.control[0].default_path) {
      defaultPath = sfzObject.control[0].default_path;
    }
    let regions: any = sfzObject.region;
    if (sfzObject.master) regions = sfzObject.master[0].region;
    if (regions) {
      this.samples = [];
      regions.forEach((region: any) => {
        const key: number = region.lokey || region.key;
        this.samples[key] = region.sample.replace('../', '');
        if (file?.path.startsWith('https')) {
          this.samples[key] = this.loader.root + defaultPath + region.sample.replace('../', '');
        }
      });
      const keys: string[] = Object.keys(this.samples);
      this.dispatchEvent('range', {
        start: Number(keys[0]),
        end: Number(keys[keys.length - 1]),
      });
      this.dispatchEvent('preload', {});
      for (const key in this.samples) {
        await this.loadSample(this.samples[key]);
      }
      this.dispatchEvent('loading', false);
    }
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
    const samplePath: string = this.samples[event.note];
    console.log('samplePath', event.note, samplePath);
    const fileRef: FileLocal | FileRemote | undefined = this.loader.files[samplePath];
    const newFile: FileLocal | FileRemote | undefined = await this.loader.getFile(fileRef || samplePath, true);
    if (this.audio) {
      this.audioBuffer = this.audio.createBufferSource();
      this.audioBuffer.buffer = newFile?.contents;
      this.audioBuffer.connect(this.audio.destination);
      this.audioBuffer.start(0);
    }
  }

  reset() {
    this.audioBuffer?.stop();
    this.samples = [];
  }
}

export default Audio;

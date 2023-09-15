import { AudioControlEvent, AudioKeyboardMap, AudioOpcodes, AudioSfzHeader, AudioSfzOpcodeObj } from '../types/audio';
import { AudioOptions } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import { getRegions, opcodesToObject, parseSfz, setParserLoader } from '../utils/parser';
import { pathDir, pathJoin } from '../utils/utils';
import { pathSubDir } from '../utils/utils';
import Sample from './Sample';

const PRELOAD: boolean = true;

class Audio extends Event {
  loader: FileLoader;
  private regions: AudioSfzOpcodeObj[] = [];
  private context: AudioContext;
  private bend: number = 0;
  private chanaft: number = 64;
  private polyaft: number = 64;
  private bpm: number = 120;
  private regionDefaults: any = {
    lochan: 0,
    hichan: 15,
    lokey: 0,
    hikey: 127,
    lovel: 0,
    hivel: 127,
    lobend: -8192,
    hibend: 8192,
    lochanaft: 0,
    hichanaft: 127,
    lopolyaft: 0,
    hipolyaft: 127,
    lorand: 0,
    hirand: 1,
    lobpm: 0,
    hibpm: 500,
  };

  constructor(options: AudioOptions) {
    super();
    if (!window.AudioContext) window.alert('Browser does not support WebAudio');
    this.context = new window.AudioContext();
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
    this.regions = getRegions(headers);
    console.log('regions', this.regions);
    this.fixPaths(headers, file);
    if (PRELOAD) await this.preloadFiles(this.regions);
    this.dispatchEvent('loading', false);
  }

  fixPaths(headers: AudioSfzHeader[], file: FileLocal | FileRemote) {
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
    for (const key in this.regions) {
      let samplePath: string = this.regions[key].sample;
      // Temporary fix for recurring samples.
      if (this.regions[key].modified) continue;
      if (!samplePath || samplePath.startsWith('https')) continue;
      if (file.path.startsWith('https')) {
        samplePath = pathJoin(pathDir(file.path), defaultPath, samplePath);
      } else if (!samplePath.startsWith(rootPath)) {
        samplePath = pathJoin(rootPath, defaultPath, samplePath);
      }
      this.regions[key].sample = samplePath;
      this.regions[key].modified = true;
    }
    this.dispatchEvent('keyboardMap', this.getKeyboardMap(this.regions));
  }

  getKeyboardMap(regions: AudioSfzOpcodeObj[]) {
    const keyboardMap: AudioKeyboardMap = {};
    for (let i = 0; i < 200; i += 1) {
      const regionsFiltered = this.checkRegions(regions, { channel: 1, note: i, velocity: 100 });
      if (regionsFiltered.length) keyboardMap[i] = true;
    }
    return keyboardMap;
  }

  async preloadFiles(regions: AudioSfzOpcodeObj[]) {
    let start: number = 0;
    const end: number = Object.keys(regions).length - 1;
    for (const key in regions) {
      this.dispatchEvent('preload', {
        status: `Loading audio files: ${start} of ${end}`,
      });
      const samplePath: string = regions[key].sample;
      if (!samplePath || samplePath.includes('*')) continue;
      await this.loader.getFile(samplePath, true);
      start += 1;
    }
  }

  checkRegion(region: AudioSfzOpcodeObj, controlEvent: AudioControlEvent, rand: number) {
    return (
      region.sample != null &&
      region.lochan <= controlEvent.channel &&
      region.hichan >= controlEvent.channel &&
      region.lokey <= controlEvent.note &&
      region.hikey >= controlEvent.note &&
      region.lovel <= controlEvent.velocity &&
      region.hivel >= controlEvent.velocity &&
      region.lobend <= this.bend &&
      region.hibend >= this.bend &&
      region.lochanaft <= this.chanaft &&
      region.hichanaft >= this.chanaft &&
      region.lopolyaft <= this.polyaft &&
      region.hipolyaft >= this.polyaft &&
      region.lorand <= rand &&
      region.hirand >= rand &&
      region.lobpm <= this.bpm &&
      region.hibpm >= this.bpm
    );
  }

  checkRegions(regions: AudioSfzOpcodeObj[], controlEvent: AudioControlEvent) {
    const random = Math.random();
    return regions.filter((region: AudioSfzOpcodeObj) => {
      if (!region.lokey && region.key) region.lokey = region.key;
      if (!region.hikey && region.key) region.hikey = region.key;
      const merged = Object.assign({}, this.regionDefaults, region);
      return this.checkRegion(merged, controlEvent, random);
    });
  }

  onKeyboard(event: any) {
    const controlEvent: AudioControlEvent = {
      channel: 1,
      note: event.data[1],
      velocity: event.data[0] === 128 ? 0 : event.data[2],
    };
    this.update(controlEvent);
    this.dispatchEvent('change', controlEvent);
  }

  async update(event: AudioControlEvent) {
    // prototype using samples
    if (event.velocity === 0) {
      return;
    }
    console.log('event', event);
    const regionsFiltered = this.checkRegions(this.regions, event);
    console.log('regionsFiltered', regionsFiltered);
    if (!regionsFiltered.length) return;
    const randomSample: number = Math.floor(Math.random() * regionsFiltered.length);
    const keySample: AudioSfzOpcodeObj = regionsFiltered[randomSample];
    console.log('keySample', keySample);
    const fileRef: FileLocal | FileRemote | undefined = this.loader.files[keySample.sample];
    const newFile: FileLocal | FileRemote | undefined = await this.loader.getFile(fileRef || keySample.sample, true);
    const sample = new Sample(this.context, newFile?.contents, keySample);
    sample.setPlaybackRate(event);
    sample.play();
  }

  reset() {
    // this.sampler.stop();
    // this.keys = [];
  }
}

export default Audio;

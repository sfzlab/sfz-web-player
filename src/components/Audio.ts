import { AudioControlEvent, AudioKeyboardMap } from '../types/audio';
import { AudioOptions } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import Sample from './Sample';
import { pathGetDirectory } from '@sfz-tools/core/dist/utils';
import { parseHeaders, parseSfz } from '@sfz-tools/core/dist/parse';
import { ParseHeader, ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';

const PRELOAD: boolean = true;

class Audio extends Event {
  loader: FileLoader;
  private regions: ParseOpcodeObj[] = [];
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
    // Use shared loader
    // parseSetLoader(this.loader);
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
    const prefix: string = pathGetDirectory(file.path);
    console.log('prefix', prefix);

    console.time('parseSfz');
    const headers: ParseHeader[] = await parseSfz(file?.contents, prefix);
    console.timeEnd('parseSfz');
    console.log('headers', headers);

    console.time('parseHeaders');
    this.regions = parseHeaders(headers, prefix);
    console.timeEnd('parseHeaders');
    console.log('regions', this.regions);

    console.time('getKeyboardMap');
    this.dispatchEvent('keyboardMap', this.getKeyboardMap(this.regions));
    console.timeEnd('getKeyboardMap');

    console.time('preloadFiles');
    if (PRELOAD) await this.preloadFiles(this.regions);
    console.timeEnd('preloadFiles');

    this.dispatchEvent('loading', false);
  }

  getKeyboardMap(regions: ParseOpcodeObj[]) {
    const keyboardMap: AudioKeyboardMap = {};
    regions.forEach((region: ParseOpcodeObj) => {
      if (!region.lokey && region.key) region.lokey = region.key;
      if (!region.hikey && region.key) region.hikey = region.key;
      const merged = Object.assign({}, this.regionDefaults, region);
      for (let i = merged.lokey; i <= merged.hikey; i += 1) {
        keyboardMap[i] = true;
      }
    });
    return keyboardMap;
  }

  async preloadFiles(regions: ParseOpcodeObj[]) {
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

  checkRegion(region: ParseOpcodeObj, controlEvent: AudioControlEvent, rand: number) {
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

  checkRegions(regions: ParseOpcodeObj[], controlEvent: AudioControlEvent) {
    const random = Math.random();
    return regions.filter((region: ParseOpcodeObj) => {
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
    const keySample: ParseOpcodeObj = regionsFiltered[randomSample];
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

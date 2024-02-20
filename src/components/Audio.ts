import { AudioControlEvent, AudioKeyboardMap } from '../types/audio';
import { AudioOptions, AudioPreload } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import Sample from './Sample';
import { midiNameToNum, pathGetDirectory } from '@sfz-tools/core/dist/utils';
import { parseHeaders, parseSfz } from '@sfz-tools/core/dist/parse';
import { ParseHeader, ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';

class Audio extends Event {
  loader: FileLoader;
  private preload: AudioPreload = AudioPreload.ON_DEMAND;
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
    if (options.preload) this.preload = options.preload;
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

    let headers: ParseHeader[] = [];
    if (file.ext === 'sfz') {
      headers = await parseSfz(file?.contents, prefix);
      console.log('headers', headers);
    } else if (file.ext === 'json') {
      headers = JSON.parse(file?.contents).elements;
    }

    this.regions = parseHeaders(headers, prefix);
    this.regions = this.midiNamesToNum(this.regions);
    console.log('regions', this.regions);

    console.log('preload', this.preload);
    if (this.preload === AudioPreload.SEQUENTIAL) {
      await this.preloadFiles(this.regions);
    } else {
      this.dispatchEvent('keyboardMap', this.getKeyboardMap(this.regions));
    }
    this.dispatchEvent('loading', false);
  }

  getKeyboardMap(regions: ParseOpcodeObj[]) {
    const keyboardMap: AudioKeyboardMap = {};
    regions.forEach((region: ParseOpcodeObj) => {
      this.updateKeyboardMap(region, keyboardMap);
    });
    return keyboardMap;
  }

  midiNameToNumConvert(val: string | number) {
    if (typeof val === 'number') return val;
    const isLetters: RegExp = /[a-zA-Z]/g;
    if (isLetters.test(val)) return midiNameToNum(val);
    return parseInt(val, 10);
  }

  midiNamesToNum(regions: ParseOpcodeObj[]) {
    for (const key in regions) {
      const region: ParseOpcodeObj = regions[key];
      if (region.lokey) region.lokey = this.midiNameToNumConvert(region.lokey);
      if (region.hikey) region.hikey = this.midiNameToNumConvert(region.hikey);
      if (region.key) region.key = this.midiNameToNumConvert(region.key);
      if (region.pitch_keycenter) region.pitch_keycenter = this.midiNameToNumConvert(region.pitch_keycenter);
    }
    return regions;
  }

  updateKeyboardMap(region: ParseOpcodeObj, keyboardMap: AudioKeyboardMap) {
    if (!region.lokey && region.key) region.lokey = region.key;
    if (!region.hikey && region.key) region.hikey = region.key;
    const merged = Object.assign({}, this.regionDefaults, region);
    for (let i = merged.lokey; i <= merged.hikey; i += 1) {
      keyboardMap[i] = true;
    }
  }

  async preloadFiles(regions: ParseOpcodeObj[]) {
    const keyboardMap: AudioKeyboardMap = {};
    this.dispatchEvent('keyboardMap', keyboardMap);
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
      this.updateKeyboardMap(regions[key], keyboardMap);
      this.dispatchEvent('keyboardMap', keyboardMap);
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

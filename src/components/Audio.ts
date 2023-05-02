import { AudioControlEvent, AudioTinySynth } from "../types/audio";
import { AudioOptions } from "../types/player";
import Event from "./event";
import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "../utils/fileLoader";
import { parseSfz, setParserLoader } from "../utils/parser";

class Audio extends Event {
  loader: FileLoader;
  private synth: AudioTinySynth;
  private audio: AudioContext;
  private audioBuffer: AudioBufferSourceNode;
  private samples: { [key: number]: string } = [];

  constructor(options: AudioOptions) {
    super();
    this.audio = new AudioContext();
    this.audioBuffer = this.audio.createBufferSource();
    if (!window.WebAudioTinySynth) {
      window.alert("webaudio-tinysynth not found, add to a <script> tag.");
    }
    this.synth = new window.WebAudioTinySynth({
      voices: 16,
      useReverb: 0,
      quality: 1,
    });
    if (!window.webAudioControlsWidgetManager) {
      window.alert("webaudio-controls not found, add to a <script> tag.");
    }
    window.webAudioControlsWidgetManager.addMidiListener((event: any) =>
      this.onKeyboard(event)
    );
    this.loader = new FileLoader();
    setParserLoader(this.loader);
    if (options.root) this.loader.setRoot(options.root);
    if (options.file) {
      const file: FileLocal | FileRemote | undefined = this.loader.addFile(
        options.file
      );
      this.showFile(file);
    }
  }

  async loadSample(url: string) {
    const file: FileLocal | FileRemote | undefined = this.loader.addFile(url);
    return this.loader.getFile(file, true);
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    file = await this.loader.getFile(file);
    const sfzObject: any = await parseSfz(file?.contents);
    console.log("showFile", file);
    console.log("parseSFZ", sfzObject);

    // hardcoded prototype for one sfz file
    if (sfzObject.master) {
      sfzObject.master[0].region.forEach((region: any) => {
        const samplePath: string = this.loader.root.replace(
          "Programs/",
          region.sample.replace("../", "")
        );
        this.samples[region.lokey] = samplePath;
      });
      for (const key in this.samples) {
        await this.loadSample(this.samples[key]);
      }
      console.log(this.samples);
      const keys: string[] = Object.keys(this.samples);
      this.dispatchEvent("load", {
        min: Number(keys[0]),
        max: Number(keys[keys.length - 1]),
      });
    }
  }

  onKeyboard(event: any) {
    const controlEvent: AudioControlEvent = {
      channel: 0x90,
      note: event.data[1],
      velocity: event.data[0] === 128 ? 0 : event.data[2],
    };
    this.setSynth(controlEvent);
    this.dispatchEvent("change", controlEvent);
  }

  async setSynth(event: AudioControlEvent) {
    // Demo using AudioTinySynth
    // this.synth.send([event.channel, event.note, event.velocity]);

    // prototype using samples
    console.log("setSynth", event);
    if (event.velocity === 0) {
      // this.audioBuffer.stop();
      return;
    }
    const samplePath: string = this.samples[event.note];
    console.log("samplePath", event.note, samplePath);
    const newFile = await this.loader.getFile(samplePath, true);
    this.audioBuffer = this.audio.createBufferSource();
    this.audioBuffer.buffer = newFile?.contents;
    this.audioBuffer.connect(this.audio.destination);
    this.audioBuffer.start(0);
  }
}

export default Audio;

import { AudioControlEvent } from "../types/audio";
import { AudioOptions } from "../types/player";
import Event from "./event";
import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "../utils/fileLoader";
import { parseSfz, setParserLoader } from "../utils/parser";

class Audio extends Event {
  loader: FileLoader;
  private audio: AudioContext;
  private audioBuffer: AudioBufferSourceNode;
  private samples: { [key: number]: string } = [];

  constructor(options: AudioOptions) {
    super();
    this.audio = new AudioContext();
    this.audioBuffer = this.audio.createBufferSource();
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

  async loadSample(path: string) {
    const fileRef: FileLocal | FileRemote | undefined = this.loader.files[path];
    if (fileRef) {
      return await this.loader.getFile(fileRef, true);
    }
    const file: FileLocal | FileRemote | undefined = this.loader.addFile(path);
    return this.loader.getFile(file, true);
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    file = await this.loader.getFile(file);
    const prefix: string = file?.path.startsWith("https")
      ? this.loader.root + "Programs/"
      : "Programs/";
    const sfzObject: any = await parseSfz(prefix, file?.contents);
    console.log("showFile", file);
    console.log("parseSFZ", sfzObject);

    // hardcoded prototype for one sfz file
    let defaultPath: string = sfzObject.control
      ? sfzObject.control[0].default_path
      : "";
    let regions: any = sfzObject.region;
    if (sfzObject.master) regions = sfzObject.master[0].region;
    if (regions) {
      regions.forEach((region: any) => {
        this.samples[region.lokey] = region.sample.replace("../", "");
        if (file?.path.startsWith("https")) {
          this.samples[region.lokey] =
            this.loader.root + defaultPath + region.sample.replace("../", "");
        }
      });
      console.log(this.samples);
      for (const key in this.samples) {
        await this.loadSample(this.samples[key]);
      }
      const keys: string[] = Object.keys(this.samples);
      this.dispatchEvent("load", {
        start: Number(keys[0]),
        end: Number(keys[keys.length - 1]),
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
    // prototype using samples
    if (event.velocity === 0) {
      // this.audioBuffer.stop();
      return;
    }
    const samplePath: string = this.samples[event.note];
    console.log("samplePath", event.note, samplePath);
    const fileRef: FileLocal | FileRemote | undefined =
      this.loader.files[samplePath];
    const newFile: FileLocal | FileRemote | undefined =
      await this.loader.getFile(fileRef || samplePath, true);
    this.audioBuffer = this.audio.createBufferSource();
    this.audioBuffer.buffer = newFile?.contents;
    this.audioBuffer.connect(this.audio.destination);
    this.audioBuffer.start(0);
  }
}

export default Audio;

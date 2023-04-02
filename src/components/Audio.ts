import * as WebAudioTinySynth from "webaudio-tinysynth";
import parseSFZ from "sfz-parser";
import { AudioControlEvent, AudioTinySynth } from "../types/audio";
import { AudioOptions } from "../types/player";
import Event from "./event";
import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "../utils/fileLoader";

class Audio extends Event {
  loader: FileLoader;
  private synth: AudioTinySynth;

  constructor(options: AudioOptions) {
    super();
    this.synth = new WebAudioTinySynth({
      voices: 16,
      useReverb: 0,
      quality: 1,
    });
    window.webAudioControlsWidgetManager.addMidiListener((event: any) =>
      this.onKeyboard(event)
    );
    if (options.loader) {
      this.loader = options.loader;
    } else {
      this.loader = new FileLoader();
    }
    if (options.file) {
      const file: FileLocal | FileRemote | undefined = this.loader.addFile(
        options.file
      );
      this.showFile(file);
    }
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    file = await this.loader.getFile(file);
    const contents: string = file?.contents.replace(
      /\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,
      ""
    );
    console.log("showFile", file);
    console.log("contents", contents);
    console.log("parseSFZ", parseSFZ(contents));
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

  setSynth(event: AudioControlEvent) {
    this.synth.send([event.channel, event.note, event.velocity]);
  }
}

export default Audio;

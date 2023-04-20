import { AudioControlEvent, AudioTinySynth } from "../types/audio";
import { AudioOptions } from "../types/player";
import Event from "./event";
import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "../utils/fileLoader";
import { parseSfz, setParserLoader } from "../utils/parser";

class Audio extends Event {
  loader: FileLoader;
  private synth: AudioTinySynth;

  constructor(options: AudioOptions) {
    super();
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

  async showFile(file: FileLocal | FileRemote | undefined) {
    file = await this.loader.getFile(file);
    console.log("showFile", file);
    console.log("parseSFZ", await parseSfz(file?.contents));
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

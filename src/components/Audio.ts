import * as WebAudioTinySynth from "webaudio-tinysynth";
import { AudioControlEvent, AudioTinySynth } from "../types/audio";
import { AudioOptions } from "../types/player";
import Event from "./event";

class Audio extends Event {
  private synth: AudioTinySynth;

  constructor(options: AudioOptions) {
    super();
    console.log("Audio", options);
    this.synth = new WebAudioTinySynth({
      voices: 16,
      useReverb: 0,
      quality: 1,
    });
    window.webAudioControlsWidgetManager.addMidiListener((event: any) =>
      this.onKeyboard(event)
    );
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

import { AudioControlEvent } from "../types/audio";
import { AudioOptions } from "../types/player";
import Event from "./event";
import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "../utils/fileLoader";
declare global {
    interface Window {
        WebAudioTinySynth: any;
        WebAudioControlsOptions: any;
        webAudioControlsWidgetManager: any;
    }
}
declare class Audio extends Event {
    loader: FileLoader;
    private synth;
    constructor(options: AudioOptions);
    showFile(file: FileLocal | FileRemote | undefined): Promise<void>;
    onKeyboard(event: any): void;
    setSynth(event: AudioControlEvent): void;
}
export default Audio;

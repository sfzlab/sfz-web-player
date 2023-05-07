import { AudioControlEvent } from "../types/audio";
import { AudioOptions } from "../types/player";
import Event from "./event";
import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "../utils/fileLoader";
declare class Audio extends Event {
    loader: FileLoader;
    private audio;
    private audioBuffer;
    private samples;
    constructor(options: AudioOptions);
    loadSample(path: string): Promise<FileRemote | undefined>;
    showFile(file: FileLocal | FileRemote | undefined): Promise<void>;
    onKeyboard(event: any): void;
    setSynth(event: AudioControlEvent): Promise<void>;
}
export default Audio;

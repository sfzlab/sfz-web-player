import { AudioControlEvent, AudioKeyboardMap, AudioSfzHeader, AudioSfzOpcodeObj } from '../types/audio';
import { AudioOptions } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
declare class Audio extends Event {
    loader: FileLoader;
    private regions;
    private context;
    private bend;
    private chanaft;
    private polyaft;
    private bpm;
    private regionDefaults;
    constructor(options: AudioOptions);
    showFile(file: FileLocal | FileRemote | undefined): Promise<void>;
    fixPaths(headers: AudioSfzHeader[], file: FileLocal | FileRemote): void;
    getKeyboardMap(regions: AudioSfzOpcodeObj[]): AudioKeyboardMap;
    preloadFiles(regions: AudioSfzOpcodeObj[]): Promise<void>;
    checkRegion(region: AudioSfzOpcodeObj, controlEvent: AudioControlEvent, rand: number): boolean;
    checkRegions(regions: AudioSfzOpcodeObj[], controlEvent: AudioControlEvent): AudioSfzOpcodeObj[];
    onKeyboard(event: any): void;
    update(event: AudioControlEvent): Promise<void>;
    reset(): void;
}
export default Audio;

import { AudioControlEvent, AudioKeyboardMap } from '../types/audio';
import { AudioOptions } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import { ParseHeader, ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';
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
    fixPaths(headers: ParseHeader[], file: FileLocal | FileRemote): void;
    getKeyboardMap(regions: ParseOpcodeObj[]): AudioKeyboardMap;
    preloadFiles(regions: ParseOpcodeObj[]): Promise<void>;
    checkRegion(region: ParseOpcodeObj, controlEvent: AudioControlEvent, rand: number): boolean;
    checkRegions(regions: ParseOpcodeObj[], controlEvent: AudioControlEvent): ParseOpcodeObj[];
    onKeyboard(event: any): void;
    update(event: AudioControlEvent): Promise<void>;
    reset(): void;
}
export default Audio;

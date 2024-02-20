import './Interface.scss';
import { InterfaceOptions } from '../types/player';
import Component from './component';
import { FileLocal, FileRemote } from '../types/files';
import { PlayerElement, PlayerElements, PlayerImage, PlayerText } from '../types/interface';
import FileLoader from '../utils/fileLoader';
import { AudioControlEvent, AudioKeyboardMap } from '../types/audio';
declare class Interface extends Component {
    private width;
    private height;
    private keyboard;
    private keyboardMap;
    private instrument;
    private loadingScreen;
    private tabs;
    loader: FileLoader;
    constructor(options: InterfaceOptions);
    showFile(file: FileLocal | FileRemote | undefined): Promise<void>;
    render(): void;
    toPercentage(val1: string, val2: number): string;
    toRelative(element: PlayerElement): {
        left: string;
        top: string;
        width: string;
        height: string;
    };
    addImage(image: PlayerImage): Promise<HTMLImageElement>;
    addImageAtr(img: HTMLImageElement, attribute: string, path: string): Promise<void>;
    addControl(type: PlayerElements, element: PlayerElement): any;
    addKeyboard(): void;
    resizeKeyboard(): void;
    setKeyboard(event: AudioControlEvent): void;
    setLoadingState(loading: boolean): void;
    setKeyboardMap(map: AudioKeyboardMap): void;
    setLoadingText(text: string): void;
    addTab(name: string): void;
    addText(text: PlayerText): HTMLSpanElement;
    parseXML(file: FileLocal | FileRemote | undefined): {
        [name: string]: any[];
    };
    reset(title?: string): void;
    setupInfo(): Promise<void>;
    setupControls(): Promise<void>;
    resizeControls(): void;
    findElements(list: {
        [name: string]: any[];
    }, nodes: any[]): {
        [name: string]: any[];
    };
}
export default Interface;
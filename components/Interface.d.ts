import "./Interface.scss";
import { InterfaceOptions } from "../types/player";
import Component from "./component";
import { FileLocal, FileRemote } from "../types/files";
import { PlayerElement, PlayerElements, PlayerImage, PlayerText } from "../types/interface";
import FileLoader from "../utils/fileLoader";
import { AudioControlEvent } from "../types/audio";
declare class Interface extends Component {
    private width;
    private height;
    private keyboard;
    private keyboardStart;
    private keyboardEnd;
    private instrument;
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
    setKeyboardRange(start: number, end: number): void;
    addTab(name: string): void;
    addText(text: PlayerText): HTMLSpanElement;
    parseXML(file: FileLocal | FileRemote | undefined): {
        [name: string]: any[];
    };
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

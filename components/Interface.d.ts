declare global {
    interface Window {
        WebAudioControlsOptions: any;
        webAudioControlsWidgetManager: any;
    }
}
import "../lib/webaudio-controls";
import "./Interface.scss";
import { InterfaceOptions } from "../types/player";
import Component from "./component";
import { FileLocal, FileRemote } from "../types/files";
import { PlayerElement, PlayerElements, PlayerImage, PlayerText } from "../types/interface";
import FileLoader from "../utils/fileLoader";
declare class Interface extends Component {
    private instrument;
    private tabs;
    loader: FileLoader;
    constructor(options: InterfaceOptions);
    showFile(file: FileLocal | FileRemote | undefined): Promise<void>;
    render(): void;
    addImage(image: PlayerImage): Promise<HTMLImageElement>;
    addImageAtr(img: HTMLImageElement, attribute: string, path: string): Promise<void>;
    addControl(type: PlayerElements, element: PlayerElement): any;
    addKeyboard(): void;
    addTab(name: string): void;
    addText(text: PlayerText): HTMLSpanElement;
    parseXML(file: FileLocal | FileRemote | undefined): {
        [name: string]: any[];
    };
    setupInfo(): Promise<void>;
    setupControls(): Promise<void>;
    findElements(list: {
        [name: string]: any[];
    }, nodes: any[]): {
        [name: string]: any[];
    };
}
export default Interface;

import "./sfzPlayer.scss";
import Component from "./component";
import { PlayerElement, PlayerElements, PlayerImage, PlayerText } from "../types/player";
import { FileItem } from "../types/files";
import FileLoader from "../utils/fileLoader";
declare class SfzPlayer extends Component {
    private basepath;
    private fileLoader;
    private instrument;
    private tabs;
    private mode;
    constructor();
    setFileLoader(fileLoader: FileLoader): void;
    addTab(name: string): void;
    load(file: FileItem): Promise<void>;
    loadXML(path: string): Promise<{
        [name: string]: any[];
    }>;
    parseXML(file: FileItem): {
        [name: string]: any[];
    };
    setupInfo(): Promise<void>;
    setupControls(): Promise<void>;
    addKeyboard(): void;
    addImage(image: PlayerImage): Promise<HTMLImageElement>;
    addImageAtr(img: HTMLImageElement, attribute: string, path: string): void;
    addControl(type: PlayerElements, element: PlayerElement): any;
    addText(text: PlayerText): HTMLSpanElement;
    findElements(list: {
        [name: string]: any[];
    }, nodes: any[]): {
        [name: string]: any[];
    };
}
export default SfzPlayer;

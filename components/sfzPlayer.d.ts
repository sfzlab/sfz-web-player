import "./sfzPlayer.scss";
import Component from "./component";
import { PlayerElement, PlayerElements, PlayerImage, PlayerText } from "../types/player";
declare class SfzPlayer extends Component {
    private basepath;
    private instrument;
    private tabs;
    constructor();
    addTab(name: string): void;
    loadFile(file: File): Promise<void>;
    loadUrl(url: string): Promise<void>;
    loadXml(url: string): Promise<{
        [name: string]: any[];
    }>;
    setupInfo(): Promise<void>;
    setupControls(): Promise<void>;
    addKeyboard(): void;
    addImage(image: PlayerImage): HTMLImageElement;
    addControl(type: PlayerElements, element: PlayerElement): any;
    addText(text: PlayerText): HTMLSpanElement;
    findElements(list: {
        [name: string]: any[];
    }, nodes: any[]): {
        [name: string]: any[];
    };
}
export default SfzPlayer;

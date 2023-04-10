import { AudioOptions, EditorOptions, InterfaceOptions, PlayerOptions } from "../types/player";
import Component from "./component";
import "./Player.scss";
declare class Player extends Component {
    private audio?;
    private editor?;
    private interface?;
    private loader;
    constructor(id: string, options: PlayerOptions);
    setupAudio(options: AudioOptions): void;
    setupInterface(options: InterfaceOptions): void;
    setupEditor(options: EditorOptions): void;
    setupHeader(): void;
}
export default Player;

import { PlayerOptions } from "../types/player";
import Component from "./component";
import "./Player.scss";
declare class Player extends Component {
    private editor?;
    private interface?;
    private loader;
    constructor(id: string, options: PlayerOptions);
    setupHeader(): void;
}
export default Player;

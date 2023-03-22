import { PlayerOptions } from "../types/player";
import Interface from "./Interface";

class Player {
  private interface?: Interface;

  constructor(options: PlayerOptions) {
    if (options.interface) {
      this.interface = new Interface(options.interface);
    }
  }
}

export default Player;

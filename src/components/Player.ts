import { PlayerOptions } from "../types/player";
import Editor from "./Editor";
import Interface from "./Interface";

class Player {
  private el: HTMLElement;
  private editor?: Editor;
  private interface?: Interface;

  constructor(id: string, options: PlayerOptions) {
    this.el = document.getElementById(id) as HTMLElement;
    if (options.interface) {
      this.interface = new Interface(options.interface);
      this.el.appendChild(this.interface.getEl());
    }
    if (options.editor) {
      this.editor = new Editor(options.editor);
      this.el.appendChild(this.editor.getEl());
    }
  }
}

export default Player;

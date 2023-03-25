import { PlayerOptions } from "../types/player";
import Component from "./component";
import Editor from "./Editor";
import Interface from "./Interface";
import "./Player.scss";
import {
  directoryOpen,
  FileWithDirectoryAndFileHandle,
} from "browser-fs-access";
import { pathDir, pathExt, pathRoot } from "../utils/utils";
import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "../utils/fileLoader";

class Player extends Component {
  private editor?: Editor;
  private interface?: Interface;
  private loader: FileLoader;

  constructor(id: string, options: PlayerOptions) {
    super("player");
    this.loader = new FileLoader();
    if (options.header) {
      this.setupHeader();
    }
    if (options.interface) {
      options.interface.loader = this.loader;
      this.interface = new Interface(options.interface);
      this.getEl().appendChild(this.interface.getEl());
    }
    if (options.editor) {
      options.editor.loader = this.loader;
      this.editor = new Editor(options.editor);
      this.getEl().appendChild(this.editor.getEl());
    }
    document.getElementById(id)?.appendChild(this.getEl());
  }

  setupHeader() {
    const div: HTMLDivElement = document.createElement("div");
    div.className = "header";

    const input: HTMLInputElement = document.createElement("input");
    input.type = "button";
    input.value = "Select directory";
    input.addEventListener("click", async (e) => {
      try {
        const blobs: FileWithDirectoryAndFileHandle[] = (await directoryOpen({
          recursive: true,
        })) as FileWithDirectoryAndFileHandle[];
        console.log(`${blobs.length} files selected.`);
        if (this.interface) {
          this.loader.setRoot(pathRoot(blobs[0].webkitRelativePath));
          this.loader.addDirectory(blobs);
          for (const blob of blobs) {
            if (
              pathExt(blob.webkitRelativePath) === "xml" &&
              pathDir(blob.webkitRelativePath) === this.loader.root
            ) {
              const file: FileLocal | FileRemote | undefined =
                this.loader.addFile(blob);
              await this.interface?.showFile(file);
            }
          }
          this.interface.render();
        }
        if (this.editor) {
          this.loader.setRoot(pathRoot(blobs[0].webkitRelativePath));
          this.loader.addDirectory(blobs);
          this.editor.render();
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          return console.error(err);
        }
        console.log("The user aborted a request.");
      }
    });
    div.appendChild(input);

    this.getEl().appendChild(div);
  }
}

export default Player;

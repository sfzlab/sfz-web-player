import {
  AudioOptions,
  EditorOptions,
  InterfaceOptions,
  PlayerOptions,
} from "../types/player";
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
import Audio from "./Audio";
import { EventData } from "../types/event";

class Player extends Component {
  private audio?: Audio;
  private editor?: Editor;
  private interface?: Interface;
  private loader: FileLoader;

  constructor(id: string, options: PlayerOptions) {
    super("player");
    this.loader = new FileLoader();
    if (options.audio) this.setupAudio(options.audio);
    if (options.header) this.setupHeader();
    if (options.interface) this.setupInterface(options.interface);
    if (options.editor) this.setupEditor(options.editor);
    document.getElementById(id)?.appendChild(this.getEl());
  }

  setupAudio(options: AudioOptions) {
    options.loader = this.loader;
    this.audio = new Audio(options);
    this.audio.addEvent("change", (event: EventData) => {
      if (this.interface) this.interface.setKeyboard(event.data);
    });
    this.audio.addEvent("load", (event: EventData) => {
      if (this.interface)
        this.interface.setKeyboardRange(event.data.start, event.data.end);
    });
  }

  setupInterface(options: InterfaceOptions) {
    options.loader = this.loader;
    this.interface = new Interface(options);
    this.interface.addEvent("change", (event: EventData) => {
      if (this.audio) this.audio.setSynth(event.data);
    });
    this.getEl().appendChild(this.interface.getEl());
  }

  setupEditor(options: EditorOptions) {
    options.loader = this.loader;
    this.editor = new Editor(options);
    this.getEl().appendChild(this.editor.getEl());
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
        if (this.audio) {
          let audioFile: FileLocal | FileRemote | undefined;
          this.audio.loader.setRoot(
            pathRoot(blobs[0].webkitRelativePath) + "Programs/"
          );
          this.audio.loader.addDirectory(blobs);
          for (const blob of blobs) {
            if (pathExt(blob.webkitRelativePath) === "sfz") {
              const file: FileLocal | FileRemote | undefined =
                this.audio.loader.addFile(blob);
              if (
                !audioFile &&
                pathDir(blob.webkitRelativePath) === this.audio.loader.root
              ) {
                audioFile = file;
              }
            }
          }
          await this.audio.showFile(audioFile);
        }
        if (this.interface) {
          let interfaceFile: FileLocal | FileRemote | undefined;
          this.interface.loader.setRoot(pathRoot(blobs[0].webkitRelativePath));
          this.interface.loader.addDirectory(blobs);
          for (const blob of blobs) {
            if (pathExt(blob.webkitRelativePath) === "xml") {
              const file: FileLocal | FileRemote | undefined =
                this.interface.loader.addFile(blob);
              if (
                !interfaceFile &&
                pathDir(blob.webkitRelativePath) === this.interface.loader.root
              ) {
                interfaceFile = file;
              }
            }
          }
          await this.interface.showFile(interfaceFile);
          this.interface.render();
        }
        if (this.editor) {
          this.editor.loader.setRoot(pathRoot(blobs[0].webkitRelativePath));
          this.editor.loader.addDirectory(blobs);
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

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
import { getJSON } from "../utils/api";

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
    if (options.instrument) {
      this.loadRemoteInstrument(options.instrument);
    }
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

    const inputLocal: HTMLInputElement = document.createElement("input");
    inputLocal.type = "button";
    inputLocal.value = "Local directory";
    inputLocal.addEventListener("click", async (e) => {
      await this.loadLocalInstrument();
    });
    div.appendChild(inputLocal);

    const inputRemote: HTMLInputElement = document.createElement("input");
    inputRemote.type = "button";
    inputRemote.value = "Remote directory";
    inputRemote.addEventListener("click", async (e) => {
      const repo: string | null = window.prompt(
        "Enter a GitHub owner/repo",
        "studiorack/black-and-green-guitars"
      );
      if (repo) await this.loadRemoteInstrument(repo);
    });
    div.appendChild(inputRemote);

    this.getEl().appendChild(div);
  }

  async loadLocalInstrument() {
    try {
      const blobs: FileWithDirectoryAndFileHandle[] = (await directoryOpen({
        recursive: true,
      })) as FileWithDirectoryAndFileHandle[];
      console.log(`${blobs.length} files selected.`);
      this.loadDirectory(pathRoot(blobs[0].webkitRelativePath), blobs);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        return console.error(err);
      }
      console.log("The user aborted a request.");
    }
  }

  async loadRemoteInstrument(repo: string) {
    const response: any = await getJSON(
      `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`
    );
    const paths: string[] = response.tree.map(
      (file: any) =>
        `https://raw.githubusercontent.com/${repo}/main/${file.path}`
    );
    await this.loadDirectory(
      `https://raw.githubusercontent.com/${repo}/main/`,
      paths
    );
  }

  async loadDirectory(
    root: string,
    files: string[] | FileWithDirectoryAndFileHandle[]
  ) {
    let audioFile: string | FileWithDirectoryAndFileHandle | undefined;
    let interfaceFile: string | FileWithDirectoryAndFileHandle | undefined;
    for (const file of files) {
      const path: string =
        typeof file === "string" ? file : file.webkitRelativePath;
      if (
        !audioFile &&
        pathExt(path) === "sfz" &&
        (pathDir(path) === root || pathDir(path) === root + "Programs/")
      ) {
        audioFile = file;
      }
      if (!interfaceFile && pathExt(path) === "xml" && pathDir(path) === root) {
        interfaceFile = file;
      }
    }
    console.log("audioFile", audioFile);
    console.log("interfaceFile", interfaceFile);
    this.loader.resetFiles();
    this.loader.setRoot(root);
    this.loader.addDirectory(files);

    if (this.interface && interfaceFile) {
      const file: FileLocal | FileRemote | undefined =
        this.interface.loader.addFile(interfaceFile);
      await this.interface.showFile(file);
      this.interface.render();
    }
    if (this.editor) {
      const defaultFile: string | FileWithDirectoryAndFileHandle | undefined =
        audioFile || interfaceFile;
      if (defaultFile) {
        const file: FileLocal | FileRemote | undefined =
          this.editor.loader.addFile(defaultFile);
        await this.editor.showFile(file);
        this.editor.render();
      }
    }
    if (this.audio && audioFile) {
      const file: FileLocal | FileRemote | undefined =
        this.audio.loader.addFile(audioFile);
      await this.audio.showFile(file);
    }
  }
}

export default Player;

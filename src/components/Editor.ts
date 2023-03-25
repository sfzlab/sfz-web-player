import * as ace from "ace-builds";
import * as path from "path-browserify";
import * as modelist from "ace-builds/src-noconflict/ext-modelist";
import "./Editor.scss";
import "ace-builds/webpack-resolver";
import { FileWithDirectoryAndFileHandle } from "browser-fs-access";
const Mode = require("../lib/mode-sfz").Mode;
import Component from "./component";
import { FileLocal, FileRemote, FilesMap, FilesTree } from "../types/files";
import { EditorOptions } from "../types/player";
import { get } from "../utils/api";
import { pathDir, pathExt, pathRoot, pathSubDir } from "../utils/utils";
import FileLoader from "../utils/fileLoader";

class Editor extends Component {
  private ace: any;
  private aceEl: HTMLDivElement;
  private fileEl: HTMLDivElement;
  loader: FileLoader;

  constructor(options: EditorOptions) {
    super("editor");

    this.fileEl = document.createElement("div");
    this.fileEl.className = "fileList";
    this.getEl().appendChild(this.fileEl);

    this.aceEl = document.createElement("div");
    this.aceEl.className = "ace";
    this.ace = ace.edit(this.aceEl, {
      theme: "ace/theme/monokai",
    });
    this.getEl().appendChild(this.aceEl);

    if (options.loader) {
      this.loader = options.loader;
    } else {
      this.loader = new FileLoader();
    }
    if (options.root) this.loader.setRoot(options.root);
    if (options.directory) {
      this.loader.addDirectory(options.directory);
      this.render();
    }
    if (options.file) {
      const file: FileLocal | FileRemote | undefined = this.loader.addFile(
        options.file
      );
      this.showFile(file);
    }
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    if (!file) return;
    if (typeof file === "string") {
      const fileKey: string = pathSubDir(file, this.loader.root);
      file = this.loader.files[fileKey];
    }
    if (!file.contents) {
      const fileKey: string = pathSubDir(file.path, this.loader.root);
      if ("handle" in file) {
        file = await this.loader.loadFile(file.handle);
        this.loader.files[fileKey] = file;
      } else {
        file = await this.loader.loadFile(file.path);
        this.loader.files[fileKey] = file;
      }
    }
    if (file.ext === "sfz") {
      this.ace.session.setMode(new Mode());
    } else {
      const mode: string = modelist.getModeForPath(file.path).mode;
      this.ace.session.setMode(mode);
    }
    this.ace.setOption("value", file.contents);
  }

  createTree(root: string, files: FilesMap, filesTree: FilesTree) {
    const ul: HTMLUListElement = document.createElement("ul");
    for (const key in filesTree) {
      const filePath: string = path.join(root, key);
      const li: HTMLLIElement = document.createElement("li");
      if (Object.keys(filesTree[key]).length > 0) {
        const details: HTMLDetailsElement = document.createElement("details");
        const summary: HTMLElement = document.createElement("summary");
        summary.innerHTML = key;
        summary.addEventListener("click", async () => {
          await this.showFile(files[filePath]);
        });
        details.appendChild(summary);
        details.appendChild(this.createTree(filePath, files, filesTree[key]));
        li.appendChild(details);
      } else {
        li.innerHTML = key;
        li.addEventListener("click", async () => {
          await this.showFile(files[filePath]);
        });
      }
      ul.appendChild(li);
    }
    return ul;
  }

  render() {
    this.fileEl.replaceChildren();
    this.fileEl.innerHTML = this.loader.root;
    const ul: HTMLUListElement = this.createTree(
      "",
      this.loader.files,
      this.loader.filesTree
    );
    ul.className = "tree";
    this.fileEl.appendChild(ul);
  }
}

export default Editor;

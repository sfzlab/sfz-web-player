import "./Editor.scss";
import Component from "./component";
import { FileLocal, FileRemote, FilesMap, FilesTree } from "../types/files";
import { EditorOptions } from "../types/player";
import FileLoader from "../utils/fileLoader";

declare global {
  interface Window {
    ace: any;
  }
}

class Editor extends Component {
  private ace: any;
  private aceEl: HTMLDivElement;
  private fileEl: HTMLDivElement;
  loader: FileLoader;

  constructor(options: EditorOptions) {
    super("editor");
    if (!window.ace) {
      window.alert("Ace editor not found, add to a <script> tag.");
    }

    this.fileEl = document.createElement("div");
    this.fileEl.className = "fileList";
    this.getEl().appendChild(this.fileEl);

    this.aceEl = document.createElement("div");
    this.aceEl.className = "ace";
    this.ace = window.ace.edit(this.aceEl, {
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
    file = await this.loader.getFile(file);
    if (!file) return;
    if (file.ext === "sfz") {
      const SfzMode = require("../lib/mode-sfz").Mode;
      this.ace.session.setMode(new SfzMode());
    } else {
      const modelist = window.ace.require("ace/ext/modelist");
      if (!modelist) {
        window.alert("Ace modelist not found, add to a <script> tag.");
      }
      const mode: string = modelist.getModeForPath(file.path).mode;
      this.ace.session.setMode(mode);
    }
    this.ace.setOption("value", file.contents);
  }

  createTree(root: string, files: FilesMap, filesTree: FilesTree) {
    const ul: HTMLUListElement = document.createElement("ul");
    for (const key in filesTree) {
      let filePath: string = root + "/" + key;
      if (filePath.startsWith("/")) filePath = filePath.slice(1);
      const li: HTMLLIElement = document.createElement("li");
      if (Object.keys(filesTree[key]).length > 0) {
        const details: HTMLDetailsElement = document.createElement("details");
        const summary: HTMLElement = document.createElement("summary");
        summary.innerHTML = key;
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

  reset() {
    this.fileEl.replaceChildren();
    this.ace.setOption("value", "");
  }
}

export default Editor;

import "./Editor.scss";
import Component from "./component";
import * as ace from "ace-builds";
import * as modelist from "ace-builds/src-noconflict/ext-modelist";
import "ace-builds/webpack-resolver";
import {
  FileGitHub,
  FileGitHubItem,
  FileItem,
  FilesMap,
  FilesNested,
} from "../types/files";
import { EditorOptions } from "../types/player";
const Mode = require("../lib/mode-sfz").Mode;
import * as path from "path-browserify";
import { FileWithDirectoryAndFileHandle } from "browser-fs-access";

class Editor extends Component {
  private branch: string = "main";
  private files: FilesMap = {};
  private filesNested: FilesNested = {};
  private directory: string = "none";
  private ace: any;
  private supportedFiles: string[] = [
    "json",
    "json",
    "md",
    "sfz",
    "txt",
    "xml",
    "yml",
    "yaml",
  ];

  private aceEl: HTMLDivElement;
  private fileEl: HTMLDivElement;

  constructor(options: EditorOptions) {
    super("editor");

    this.fileEl = document.createElement("div");
    this.fileEl.className = "fileList";
    this.fileEl.innerHTML = "No directory selected";
    this.getEl().appendChild(this.fileEl);
    if (options.url) this.loadDirectoryRemote(options.url);

    this.aceEl = document.createElement("div");
    this.aceEl.className = "ace";
    this.ace = ace.edit(this.aceEl, {
      theme: "ace/theme/monokai",
    });
    this.getEl().appendChild(this.aceEl);
  }

  async loadDirectoryLocal(
    blobs: FileWithDirectoryAndFileHandle[] | FileSystemDirectoryHandle[]
  ) {
    this.files = {};
    this.filesNested = {};
    blobs
      .sort((a: any, b: any) => a.webkitRelativePath.localeCompare(b))
      .forEach((blob: any) => {
        const pathElements: string[] = blob.webkitRelativePath.split("/");
        this.directory = pathElements.shift() || "none"; // remove root path
        this.files[pathElements.join("/")] = blob;
        pathElements.reduce(
          (o: any, k: string) => (o[k] = o[k] || {}),
          this.filesNested
        );
      });
    console.log("loadDirectoryLocal", this.files, this.filesNested);
    this.render(this.branch, this.directory, this.files, this.filesNested);
  }

  async loadDirectoryRemote(repo: string) {
    let response: any = await fetch(
      `https://api.github.com/repos/${repo}/git/trees/${this.branch}?recursive=1`
    );
    // TODO write this properly.
    if (!response.ok) {
      this.branch = "master";
      response = await fetch(
        `https://api.github.com/repos/${repo}/git/trees/${this.branch}?recursive=1`
      );
    }
    const githubTree: FileGitHub = await response.json();
    this.files = {};
    this.filesNested = {};
    githubTree.tree.forEach((githubFile: FileGitHubItem) => {
      this.files[githubFile.path] = githubFile;
      githubFile.path
        .split("/")
        .reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesNested);
    });
    this.directory = repo;
    console.log("loadDirectoryRemote", this.files, this.filesNested);
    this.render(this.branch, this.directory, this.files, this.filesNested);
  }

  async loadJSON(path: string) {
    console.log("loadJSON", path);
    const response: any = await fetch(path);
    return await response.json();
  }

  async getFile(path: string) {
    const response: any = await fetch(path);
    return {
      ext: this.getExt(path),
      contents: await response.text(),
      path,
    };
  }

  createTree(
    root: string,
    branch: string,
    directory: string,
    files: FilesMap,
    filesNested: FilesNested
  ) {
    const ul: HTMLUListElement = document.createElement("ul");
    for (const key in filesNested) {
      const filePath: string = path.join(root, key);
      const file: FileGitHubItem | File = files[filePath];
      if (file && "url" in file) {
        file.url = `https://raw.githubusercontent.com/${directory}/${branch}/${filePath}`;
      }
      const li: HTMLLIElement = document.createElement("li");
      if (Object.keys(filesNested[key]).length > 0) {
        const details: HTMLDetailsElement = document.createElement("details");
        const summary: HTMLElement = document.createElement("summary");
        summary.innerHTML = key;
        summary.addEventListener("click", async () => {
          if (file && "url" in file) await this.clickFile(file.url);
        });
        details.appendChild(summary);
        details.appendChild(
          this.createTree(filePath, branch, directory, files, filesNested[key])
        );
        li.appendChild(details);
      } else {
        li.innerHTML = key;
        li.addEventListener("click", async () => {
          if (file && "url" in file) await this.clickFile(file.url);
        });
      }
      ul.appendChild(li);
    }
    return ul;
  }

  getExt(path: string) {
    return path.split(".").pop() || "none";
  }

  async clickFile(path: string) {
    if (!this.supportedFiles.includes(this.getExt(path))) return;
    const file: FileItem = await this.getFile(path);
    if (file.ext === "sfz") {
      this.ace.session.setMode(new Mode());
    } else {
      const mode: string = modelist.getModeForPath(file.path).mode;
      this.ace.session.setMode(mode);
    }
    this.ace.setOption("value", file.contents);
  }

  render(
    branch: string,
    directory: string,
    files: FilesMap,
    filesNested: FilesNested
  ) {
    this.fileEl.replaceChildren();
    this.fileEl.innerHTML = directory;
    const ul: HTMLUListElement = this.createTree(
      "",
      branch,
      directory,
      files,
      filesNested
    );
    ul.className = "tree";
    this.fileEl.appendChild(ul);
  }
}

export default Editor;

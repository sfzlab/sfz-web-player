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
import { get } from "../utils/api";
import { pathGetExt, pathGetSubDirectories } from "../utils/utils";

class Editor extends Component {
  private branch: string = "main";
  private files: FilesMap = {};
  private filesNested: FilesNested = {};
  private root: string = "";
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
    this.getEl().appendChild(this.fileEl);

    this.aceEl = document.createElement("div");
    this.aceEl.className = "ace";
    this.ace = ace.edit(this.aceEl, {
      theme: "ace/theme/monokai",
    });
    this.getEl().appendChild(this.aceEl);

    if (options.root) this.root = options.root;
    if (options.url) this.loadUrl(options.url);
  }

  async loadUrl(url: string) {
    if (!this.supportedFiles.includes(pathGetExt(url))) return;
    const file: FileItem = {
      ext: pathGetExt(url),
      contents: await get(url),
      path: decodeURI(url),
    };
    this.addFile(file);
    this.render(this.branch, this.root, this.files, this.filesNested);
    this.showFile(file);
  }

  showFile(file: FileItem) {
    if (!file) return;
    if (file.ext === "sfz") {
      this.ace.session.setMode(new Mode());
    } else {
      const mode: string = modelist.getModeForPath(file.path).mode;
      this.ace.session.setMode(mode);
    }
    this.ace.setOption("value", file.contents);
  }

  addFile(file: FileItem) {
    const pathSubDir: string = pathGetSubDirectories(file.path, this.root);
    this.files[pathSubDir] = file;
    pathSubDir
      .split("/")
      .reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesNested);
  }

  async loadDirectoryLocal(blobs: FileWithDirectoryAndFileHandle[]) {
    this.root = blobs[0].webkitRelativePath.split("/").shift() || "none";
    this.files = {};
    this.filesNested = {};
    blobs.forEach(async (file: FileWithDirectoryAndFileHandle) => {
      this.addFile({
        ext: pathGetExt(file.webkitRelativePath),
        contents: await file.text(),
        path: file.webkitRelativePath,
      });
    });
    console.log("loadDirectoryLocal", this.files, this.filesNested);
    this.render(this.branch, this.root, this.files, this.filesNested);
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
    this.root = repo;
    this.files = {};
    this.filesNested = {};
    githubTree.tree.forEach((githubFile: FileGitHubItem) => {
      this.files[githubFile.path] = githubFile;
      githubFile.path
        .split("/")
        .reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesNested);
    });
    console.log("loadDirectoryRemote", this.files, this.filesNested);
    this.render(this.branch, this.root, this.files, this.filesNested);
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
      const file: FileItem | FileGitHubItem | File = files[filePath];
      const li: HTMLLIElement = document.createElement("li");
      if (Object.keys(filesNested[key]).length > 0) {
        const details: HTMLDetailsElement = document.createElement("details");
        const summary: HTMLElement = document.createElement("summary");
        summary.innerHTML = key;
        summary.addEventListener("click", async () => {
          this.showFile(file as FileItem);
        });
        details.appendChild(summary);
        details.appendChild(
          this.createTree(filePath, branch, directory, files, filesNested[key])
        );
        li.appendChild(details);
      } else {
        li.innerHTML = key;
        li.addEventListener("click", async () => {
          this.showFile(file as FileItem);
        });
      }
      ul.appendChild(li);
    }
    return ul;
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

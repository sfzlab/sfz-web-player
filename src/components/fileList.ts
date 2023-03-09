import {
  FileGitHub,
  FileGitHubItem,
  FilesMap,
  FilesNested,
} from "../types/files";
import Component from "./component";
import "./fileList.scss";
import * as path from "path-browserify";

class FileList extends Component {
  private branch: string = "main";
  private files: FilesMap = {};
  private filesNested: FilesNested = {};
  private instrument: string = "none";

  constructor() {
    super("fileList");
  }

  render() {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = this.instrument;
    const ul: HTMLUListElement = this.createTree("", this.filesNested);
    ul.className = "tree";
    div.appendChild(ul);
    this.getEl().replaceChildren();
    this.getEl().appendChild(div);
  }

  createTree(root: string, filesNested: FilesNested) {
    const ul: HTMLUListElement = document.createElement("ul");
    for (const key in filesNested) {
      const filePath: string = path.join(root, key);
      const file: FileGitHubItem | File = this.files[filePath];
      if (file && "url" in file) {
        file.url = `https://raw.githubusercontent.com/${this.instrument}/${this.branch}/${filePath}`;
      }
      const li: HTMLLIElement = document.createElement("li");
      if (Object.keys(filesNested[key]).length > 0) {
        const details: HTMLDetailsElement = document.createElement("details");
        const summary: HTMLElement = document.createElement("summary");
        summary.innerHTML = key;
        summary.addEventListener("click", () => {
          this.dispatchEvent("click", file);
        });
        details.appendChild(summary);
        details.appendChild(this.createTree(filePath, filesNested[key]));
        li.appendChild(details);
      } else {
        li.innerHTML = key;
        li.addEventListener("click", () => {
          this.dispatchEvent("click", file);
        });
      }
      ul.appendChild(li);
    }
    return ul;
  }

  async remoteUrl(data: any) {
    let response: any = await fetch(
      `https://api.github.com/repos/${data.repo}/git/trees/${this.branch}?recursive=1`
    );
    // TODO write this properly.
    if (!response.ok) {
      this.branch = "master";
      response = await fetch(
        `https://api.github.com/repos/${data.repo}/git/trees/${this.branch}?recursive=1`
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
    this.instrument = data.repo;
    this.render();
  }

  localDirectory(blobs: File[]) {
    if (blobs.length && !(blobs[0] instanceof File)) {
      console.log("No files in directory.");
      return;
    }
    this.files = {};
    this.filesNested = {};
    blobs
      .sort((a: any, b: any) => a.webkitRelativePath.localeCompare(b))
      .forEach((blob: any) => {
        const pathElements: string[] = blob.webkitRelativePath.split("/");
        this.instrument = pathElements.shift() || "none"; // remove root path
        this.files[pathElements.join("/")] = blob;
        pathElements.reduce(
          (o: any, k: string) => (o[k] = o[k] || {}),
          this.filesNested
        );
      });
    this.render();
  }
}

export default FileList;

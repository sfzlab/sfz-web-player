import { FileGitHubItem, FilesMap, FilesNested } from "../types/files";
import Component from "./component";
import "./fileList.scss";
import * as path from "path-browserify";

class FileList extends Component {
  constructor() {
    super("fileList");
  }

  render(
    branch: string,
    directory: string,
    files: FilesMap,
    filesNested: FilesNested
  ) {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = directory;
    const ul: HTMLUListElement = this.createTree(
      "",
      branch,
      directory,
      files,
      filesNested
    );
    ul.className = "tree";
    div.appendChild(ul);
    this.getEl().replaceChildren();
    this.getEl().appendChild(div);
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
        summary.addEventListener("click", () => {
          this.dispatchEvent("click", file);
        });
        details.appendChild(summary);
        details.appendChild(
          this.createTree(filePath, branch, directory, files, filesNested[key])
        );
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
}

export default FileList;

import { EventData } from "../types/event";
import { FileItem, FilesNested, FileTree } from "../types/files";
import { PluginInterface } from "../types/instruments";
import Component from "./component";
import "./fileList.scss";

class FileList extends Component {
  private files: FileItem[] = [];
  private filesNested: FilesNested = {};
  private instrument: any = {};

  constructor() {
    super("fileList");
  }

  render() {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = this.instrument.repo;
    const ul: HTMLUListElement = this.createTree("", this.filesNested);
    ul.className = "tree";
    div.appendChild(ul);
    this.getEl().replaceChildren();
    this.getEl().appendChild(div);
  }

  createTree(path: string, filesNested: FilesNested) {
    const ul: HTMLUListElement = document.createElement("ul");
    for (const key in filesNested) {
      const fileUrl: string = `https://raw.githubusercontent.com/${this.instrument.repo}/main/${path}/${key}`;
      const li: HTMLLIElement = document.createElement("li");
      if (Object.keys(filesNested[key]).length > 0) {
        const details: HTMLDetailsElement = document.createElement("details");
        const summary: HTMLElement = document.createElement("summary");
        summary.innerHTML = key;
        summary.addEventListener("click", () => {
          this.dispatchEvent("click", fileUrl);
        });
        details.appendChild(summary);
        details.appendChild(
          this.createTree(`${path}/${key}`, filesNested[key])
        );
        li.appendChild(details);
      } else {
        li.innerHTML = key;
        li.addEventListener("click", () => {
          this.dispatchEvent("click", fileUrl);
        });
      }
      ul.appendChild(li);
    }
    return ul;
  }

  async fileLoad(eventData: EventData) {
    const response: any = await fetch(
      `https://api.github.com/repos/${eventData.data.repo}/git/trees/main?recursive=1`
    );
    const githubTree: FileTree = await response.json();
    this.files = githubTree.tree;
    this.files.forEach((p) =>
      p.path
        .split("/")
        .reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesNested)
    );
    this.instrument = eventData.data;
    this.render();
  }
}

export default FileList;

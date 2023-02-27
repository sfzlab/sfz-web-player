import { EventData } from "../types/event";
import { FileItem, FileTree } from "../types/files";
import Component from "./component";
import "./fileList.scss";

class FileList extends Component {
  private files: FileItem[] = [];

  constructor() {
    super("fileList");
    this.render();
  }

  render() {
    const ul: HTMLUListElement = document.createElement("ul");
    this.files.forEach((fileItem: FileItem) => {
      console.log(fileItem);
      const li: HTMLLIElement = document.createElement("li");
      li.innerHTML = fileItem.path;
      li.addEventListener("click", () => {
        this.dispatchEvent("click", fileItem.path);
      });
      ul.appendChild(li);
    });
    this.getEl().replaceChildren();
    this.getEl().appendChild(ul);
  }

  async fileLoad(eventData: EventData) {
    const response: any = await fetch(
      `https://api.github.com/repos/${eventData.data.repo}/git/trees/main?recursive=1`
    );
    const githubTree: FileTree = await response.json();
    this.files = githubTree.tree;
    console.log(eventData.data.repo, githubTree.tree);
    this.render();
  }
}

export default FileList;

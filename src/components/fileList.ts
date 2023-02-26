import { EventData } from "../types/event";
import Component from "./component";
import "./fileList.scss";

class FileList extends Component {
  private files = [];

  constructor() {
    super();
    this.render();
  }

  render() {
    const ul: HTMLUListElement = document.createElement("ul");
    ul.className = "fileList";
    this.files.forEach((fileId: string) => {
      const li: HTMLLIElement = document.createElement("li");
      li.className = "fileListItem";
      li.innerHTML = "";
      li.addEventListener("click", () => {
        this.dispatchEvent("click", fileId);
      });
      ul.appendChild(li);
    });
    this.getEl().appendChild(ul);
  }

  fileLoad(eventData: EventData) {
    console.log(eventData.data.repo);
  }
}

export default FileList;

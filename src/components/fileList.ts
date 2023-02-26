import Component from "./component";
import "./FileList.scss";

class FileList extends Component {
  files = [];

  render() {
    const ul: HTMLUListElement = document.createElement("ul");
    ul.className = "fileList";
    this.files.forEach((fileId: string) => {
      const li: HTMLLIElement = document.createElement("li");
      li.className = "fileListItem";
      li.innerHTML = "";
      li.setAttribute("data-id", fileId);
      li.addEventListener("click", this.onClick.bind(this));
      ul.appendChild(li);
    });
    this.el.appendChild(ul);
  }

  onClick(e: MouseEvent) {
    const fileId: string =
      (e.target as HTMLLIElement).getAttribute("data-id") || "";
    console.log(fileId);
    window.alert(fileId);
    this.dispatchEvent("click", fileId);
  }
}

export default FileList;

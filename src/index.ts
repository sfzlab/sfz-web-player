import Component from "./components/component";
import InstrumentList from "./components/instrumentList";
import FileList from "./components/fileList";
import "./index.scss";

class Index extends Component {
  constructor() {
    super();
    this.render();
  }

  render() {
    const instrumentList: InstrumentList = new InstrumentList();
    instrumentList.addEvent("click", this.loadFiles);
    const fileList: FileList = new FileList();
    this.getEl().appendChild(instrumentList.getEl());
    this.getEl().appendChild(fileList.getEl());
  }

  loadFiles(data: any) {
    console.log("loadFiles", data.data.name);
  }
}

const index: Index = new Index();
document.body.appendChild(index.getEl());

export default Index;

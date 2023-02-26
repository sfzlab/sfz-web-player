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
    const fileList: FileList = new FileList();
    const instrumentList: InstrumentList = new InstrumentList();
    instrumentList.addEvent("click", fileList.fileLoad);
    this.getEl().appendChild(instrumentList.getEl());
    this.getEl().appendChild(fileList.getEl());
  }
}

const index: Index = new Index();
document.body.appendChild(index.getEl());

export default Index;

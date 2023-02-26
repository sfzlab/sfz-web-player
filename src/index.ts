import Component from "./components/component";
import InstrumentList from "./components/instrumentList";
import FileList from "./components/fileList";
import "./index.scss";

class Index extends Component {
  render() {
    const instrumentList: InstrumentList = new InstrumentList();
    instrumentList.render();
    const fileList: FileList = new FileList();
    fileList.render();
    this.el.appendChild(instrumentList.el);
    this.el.appendChild(fileList.el);
  }
}

const index: Index = new Index();
index.render();
document.body.appendChild(index.el);

export default Index;

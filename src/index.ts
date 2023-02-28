import Component from "./components/component";
import InstrumentList from "./components/instrumentList";
import FileList from "./components/fileList";
import "./index.scss";
import { EventData } from "./types/event";
import CodeEditor from "./components/codeEditor";

class Index extends Component {
  constructor() {
    super("index");
    this.render();
  }

  render() {
    // Code editor.
    const codeEditor: CodeEditor = new CodeEditor();

    // File list.
    const fileList: FileList = new FileList();
    fileList.addEvent("click", (eventData: EventData) => {
      codeEditor.loadFile(eventData.data);
    });

    // Instrument list.
    const instrumentList: InstrumentList = new InstrumentList();
    instrumentList.addEvent("click", (eventData: EventData) => {
      fileList.fileLoad(eventData);
    });
    this.getEl().appendChild(instrumentList.getEl());
    this.getEl().appendChild(fileList.getEl());
    this.getEl().appendChild(codeEditor.getEl());
  }
}

const index: Index = new Index();
document.body.appendChild(index.getEl());

export default Index;

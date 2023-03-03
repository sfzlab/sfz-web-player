import "./lib/webaudio-controls";
import Component from "./components/component";
import InstrumentList from "./components/instrumentList";
import FileList from "./components/fileList";
import "./index.scss";
import { EventData } from "./types/event";
import CodeEditor from "./components/codeEditor";
import SfzPlayer from "./components/sfzPlayer";

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
      // sfzPlayer.loadUI('https://raw.githubusercontent.com/studiorack/black-and-green-guitars/main/Black%20And%20Green%20Guitars.bank.xml');
    });

    const sourceEl: HTMLDivElement = document.createElement("div");
    sourceEl.className = "sourceEl";
    sourceEl.appendChild(instrumentList.getEl());
    sourceEl.appendChild(fileList.getEl());
    sourceEl.appendChild(codeEditor.getEl());
    this.getEl().appendChild(sourceEl);

    // Sfz player
    const sfzPlayer: SfzPlayer = new SfzPlayer();
    sfzPlayer.loadInstrument("./instrument/Black And Green Guitars.bank.xml");
    this.getEl().appendChild(sfzPlayer.getEl());
  }
}

const index: Index = new Index();
document.body.appendChild(index.getEl());

export default Index;

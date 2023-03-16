import "./lib/webaudio-controls";
import Component from "./components/component";
import InstrumentList from "./components/instrumentList";
import FileList from "./components/fileList";
import "./index.scss";
import { EventData } from "./types/event";
import CodeEditor from "./components/codeEditor";
import SfzPlayer from "./components/sfzPlayer";
import FileLoader from "./utils/fileLoader";
import { FileItem, FileObject, FilesMap, FilesNested } from "./types/files";

class Index extends Component {
  constructor() {
    super("index");
    this.render();
  }

  render() {
    // Code editor.
    const codeEditor: CodeEditor = new CodeEditor();

    // File loader.
    const fileLoader: FileLoader = new FileLoader();

    // File list.
    const fileList: FileList = new FileList();
    fileList.addEvent("click", async (eventData: EventData) => {
      if (!eventData.data) return;
      if (eventData.data.url) {
        const file: FileItem = await fileLoader.loadFileRemote(eventData.data);
        codeEditor.render(file);
        sfzPlayer.load(file);
      } else {
        const file: FileItem = await fileLoader.loadFileLocal(eventData.data);
        codeEditor.render(file);
        sfzPlayer.load(file);
      }
    });

    // Instrument list.
    const instrumentList: InstrumentList = new InstrumentList();
    instrumentList.addEvent("click", async (eventData: EventData) => {
      const { branch, directory, files, filesNested }: FileObject =
        await fileLoader.loadDirectoryRemote(eventData.data);
      fileList.render(branch, directory, files, filesNested);
    });
    instrumentList.addEvent("change", async (eventData: EventData) => {
      const { branch, directory, files, filesNested }: FileObject =
        await fileLoader.loadDirectoryLocal(eventData.data);
      fileList.render(branch, directory, files, filesNested);
    });

    const sourceEl: HTMLDivElement = document.createElement("div");
    sourceEl.className = "sourceEl";
    sourceEl.appendChild(instrumentList.getEl());
    sourceEl.appendChild(fileList.getEl());
    sourceEl.appendChild(codeEditor.getEl());
    this.getEl().appendChild(sourceEl);

    // Sfz player
    const sfzPlayer: SfzPlayer = new SfzPlayer();
    sfzPlayer.setFileLoader(fileLoader);
    this.getEl().appendChild(sfzPlayer.getEl());
  }
}

const index: Index = new Index();
document.body.appendChild(index.getEl());

export default Index;

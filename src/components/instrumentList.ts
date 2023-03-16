import Component from "./component";
import "./instrumentList.scss";
import * as instruments from "../data/instruments.json";
import { PluginEntry, PluginInterface, PluginPack } from "../types/instruments";
import {
  directoryOpen,
  FileWithDirectoryAndFileHandle,
} from "browser-fs-access";

class InstrumentList extends Component {
  private plugins: PluginPack = instruments.objects;

  constructor() {
    super("instrumentList");
    this.render();
    this.addFileSelect();
  }

  render() {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = "<h3>From GitHub</h3>";
    this.getEl().appendChild(div);
    const ul: HTMLUListElement = document.createElement("ul");
    Object.keys(this.plugins).forEach((pluginId: string) => {
      const li: HTMLLIElement = document.createElement("li");
      li.innerHTML = this.pluginLatest(pluginId).name;
      li.addEventListener("click", () => {
        this.dispatchEvent("click", this.pluginLatest(pluginId));
      });
      ul.appendChild(li);
    });
    this.getEl().appendChild(ul);
  }

  addFileSelect() {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = "<h3>From local</h3>";
    this.getEl().appendChild(div);
    const input: HTMLInputElement = document.createElement("input");
    input.type = "button";
    input.value = "Select directory";
    input.addEventListener("click", async (e) => {
      try {
        const blobs:
          | FileWithDirectoryAndFileHandle[]
          | FileSystemDirectoryHandle[] = await directoryOpen({
          recursive: true,
        });
        this.dispatchEvent("change", blobs);
        console.log(`${blobs.length} files selected.`);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          return console.error(err);
        }
        console.log("The user aborted a request.");
      }
    });
    this.getEl().appendChild(input);
  }

  pluginLatest(pluginId: string): PluginInterface {
    const pluginEntry: PluginEntry = this.plugins[pluginId];
    return pluginEntry.versions[pluginEntry.version];
  }
}

export default InstrumentList;

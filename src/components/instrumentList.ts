import Component from "./component";
import "./instrumentList.scss";
import * as instruments from "../data/instruments.json";
import { PluginEntry, PluginInterface, PluginPack } from "../types/instruments";

class InstrumentList extends Component {
  private plugins: PluginPack = instruments.objects;

  constructor() {
    super("instrumentList");
    this.render();
  }

  render() {
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

  pluginLatest(pluginId: string): PluginInterface {
    const pluginEntry: PluginEntry = this.plugins[pluginId];
    return pluginEntry.versions[pluginEntry.version];
  }
}

export default InstrumentList;

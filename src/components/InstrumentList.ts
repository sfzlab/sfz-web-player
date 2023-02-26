import Component from "./component";
import "./InstrumentList.scss";
import * as instruments from "../data/instruments.json";
import { PluginEntry, PluginInterface, PluginPack } from "../types/instruments";

class InstrumentList extends Component {
  private plugins: PluginPack = instruments.objects;

  constructor() {
    super();
    this.render();
  }

  pluginLatest(pluginId: string): PluginInterface {
    const pluginEntry: PluginEntry = this.plugins[pluginId];
    return pluginEntry.versions[pluginEntry.version];
  }

  render() {
    const ul: HTMLUListElement = document.createElement("ul");
    ul.className = "instrumentList";
    Object.keys(this.plugins).forEach((pluginId: string) => {
      const li: HTMLLIElement = document.createElement("li");
      li.className = "instrumentListItem";
      li.innerHTML = this.pluginLatest(pluginId).name;
      li.addEventListener("click", () => {
        this.dispatchEvent("click", this.pluginLatest(pluginId));
      });
      ul.appendChild(li);
    });
    this.getEl().appendChild(ul);
  }
}

export default InstrumentList;

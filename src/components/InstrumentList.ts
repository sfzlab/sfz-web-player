import Component from "./component";
import "./InstrumentList.scss";
import * as instruments from "../data/instruments.json";
import { PluginEntry, PluginInterface, PluginPack } from "../types/instruments";

class InstrumentList extends Component {
  plugins: PluginPack = instruments.objects;

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
      li.setAttribute("data-id", pluginId);
      li.addEventListener("click", this.onClick.bind(this));
      ul.appendChild(li);
    });
    this.el.appendChild(ul);
  }

  onClick(e: MouseEvent) {
    const pluginId: string =
      (e.target as HTMLLIElement).getAttribute("data-id") || "";
    console.log(this.pluginLatest(pluginId));
    window.alert(this.pluginLatest(pluginId).description);
    this.dispatchEvent("click", pluginId);
  }
}

export default InstrumentList;

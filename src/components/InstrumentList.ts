import "./InstrumentList.scss";
import * as instruments from "../data/instruments.json";
import { PluginEntry, PluginInterface, PluginPack } from "../types/instruments";

class InstrumentList {
  el: DocumentFragment = document.createDocumentFragment();
  plugins: PluginPack = instruments.objects;

  pluginLatest(pluginId: string): PluginInterface {
    const pluginEntry: PluginEntry = this.plugins[pluginId];
    return pluginEntry.versions[pluginEntry.version];
  }

  render(): DocumentFragment {
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
    return this.el;
  }

  onClick(e: MouseEvent) {
    const pluginId: string =
      (e.target as HTMLLIElement).getAttribute("data-id") || "";
    console.log(this.pluginLatest(pluginId));
    window.alert(this.pluginLatest(pluginId).description);
  }
}

export default InstrumentList;

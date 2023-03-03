import "./sfzPlayer.scss";
import Component from "./component";
import { xml2js } from "xml-js";
import { PlayerImage } from "../types/player";

class SfzPlayer extends Component {
  private instrument: { [name: string]: any[] } = {};

  constructor() {
    super("sfzPlayer");
  }

  async loadInstrument(url: string) {
    console.log("loadInstrument", url);
    this.instrument = await this.loadXml(url);
    console.log("instrument", this.instrument);
    this.setupGui();
  }

  async loadXml(url: string) {
    const response: any = await fetch(url);
    const file: string = await response.text();
    const fileParsed: any = xml2js(file);
    return this.findElements({}, fileParsed.elements);
  }

  async setupGui() {
    const fileGui: any = await this.loadXml(
      "./instrument/" + this.instrument.AriaGUI[0].attributes.path
    );
    console.log("fileGui", fileGui);
    this.setupImage(fileGui.StaticImage[0].attributes);
  }

  setupImage(image: PlayerImage) {
    const img: HTMLImageElement = document.createElement("img");
    img.setAttribute("style", `left: ${image.x}; top: ${image.y}`);
    img.setAttribute("height", image.h);
    img.setAttribute("src", "./instrument/GUI/" + image.image);
    img.setAttribute("width", image.w);
    this.getEl().appendChild(img);
  }

  findElements(list: { [name: string]: any[] }, nodes: any[]) {
    nodes.forEach((node: any) => {
      if (node.type === "element") {
        if (!list[node.name]) list[node.name] = [];
        list[node.name].push(node);
      }
      if (node.elements) {
        this.findElements(list, node.elements);
      }
    });
    return list;
  }
}

export default SfzPlayer;

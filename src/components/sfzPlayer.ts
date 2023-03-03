import "./sfzPlayer.scss";
import Component from "./component";
import { xml2js } from "xml-js";
import { PlayerImage, PlayerKnob } from "../types/player";

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
    this.setupProgram();
  }

  async loadXml(url: string) {
    const response: any = await fetch(url);
    const file: string = await response.text();
    const fileParsed: any = xml2js(file);
    return this.findElements({}, fileParsed.elements);
  }

  async setupGui() {
    const fileGui: any = await this.loadXml(
      "./instrument/" + this.instrument.AriaGUI[0].path
    );
    console.log("fileGui", fileGui);
    this.addImage(fileGui.StaticImage[0]);
    // this.addKeyboard();
  }

  addKeyboard() {
    const keys: HTMLElement = document.createElement("webaudio-keyboard");
    keys.setAttribute("keys", "25");
    this.getEl().appendChild(keys);
  }

  addImage(image: PlayerImage) {
    const img: HTMLImageElement = document.createElement("img");
    img.setAttribute(
      "style",
      `position:absolute; left: ${image.x}; top: ${image.y}`
    );
    img.setAttribute("height", image.h);
    img.setAttribute("src", "./instrument/GUI/" + image.image);
    img.setAttribute("width", image.w);
    this.getEl().appendChild(img);
  }

  addControl(type: string, data: any) {
    const el: any = document.createElement(`webaudio-${type}`);
    el.setAttribute("src", "./instrument/GUI/" + data.image);
    el.setAttribute(
      "style",
      `position:absolute; left: ${data.x}px; top: ${data.y}px`
    );
    el.setAttribute("value", "0");
    el.setAttribute("max", data.frames - 1);
    el.setAttribute("step", "1");
    el.setAttribute("sprites", data.frames - 1);
    el.setAttribute("tooltip", "%d");
    this.getEl().appendChild(el);
  }

  async setupProgram() {
    const fileProgram: any = await this.loadXml(
      "./instrument/" + this.instrument.AriaProgram[0].gui
    );
    console.log("fileProgram", fileProgram);
    fileProgram.Knob.forEach((knob: PlayerKnob) => {
      this.addControl("knob", knob);
    });
  }

  findElements(list: { [name: string]: any[] }, nodes: any[]) {
    nodes.forEach((node: any) => {
      if (node.type === "element") {
        if (!list[node.name]) list[node.name] = [];
        list[node.name].push(node.attributes);
      }
      if (node.elements) {
        this.findElements(list, node.elements);
      }
    });
    return list;
  }
}

export default SfzPlayer;

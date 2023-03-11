import "./sfzPlayer.scss";
import Component from "./component";
import { xml2js } from "xml-js";
import {
  PlayerButton,
  PlayerElement,
  PlayerElements,
  PlayerImage,
  PlayerKnob,
  PlayerSlider,
  PlayerText,
} from "../types/player";
import { FileGitHubItem, FileItem } from "../types/files";
import FileLoader from "../utils/fileLoader";

class SfzPlayer extends Component {
  private basepath: string = "";
  private fileLoader: any;
  private instrument: { [name: string]: any[] } = {};
  private tabs: HTMLDivElement;

  constructor() {
    super("sfzPlayer");

    this.tabs = document.createElement("div");
    this.tabs.className = "tabs";
    this.addTab("Info");
    this.addTab("Controls");
    this.getEl().appendChild(this.tabs);
    this.addKeyboard();
  }

  setFileLoader(fileLoader: FileLoader) {
    this.fileLoader = fileLoader;
  }

  addTab(name: string) {
    const input: HTMLInputElement = document.createElement("input");
    input.className = "radiotab";
    if (name === "Info") input.setAttribute("checked", "checked");
    input.type = "radio";
    input.id = name.toLowerCase();
    input.name = "tabs";
    this.tabs.appendChild(input);

    const label: HTMLLabelElement = document.createElement("label");
    label.className = "label";
    label.setAttribute("for", name.toLowerCase());
    label.innerHTML = name;
    this.tabs.appendChild(label);

    const div: HTMLDivElement = document.createElement("div");
    div.className = "panel";
    this.tabs.appendChild(div);
  }

  async load(file: FileItem) {
    if (file.ext !== "xml") return;
    this.basepath = file.path.substring(0, file.path.lastIndexOf("/") + 1);
    const fileParsed: any = xml2js(file.contents);
    this.instrument = this.findElements({}, fileParsed.elements);
    this.setupInfo();
    this.setupControls();
  }

  async loadXml(path: string) {
    console.log("loadXml", path);
    const file: FileGitHubItem | File = this.fileLoader.getFiles()[path];
    let fileGui: FileItem;
    if ("url" in file) {
      fileGui = await this.fileLoader.loadFileRemote(file);
    } else {
      fileGui = await this.fileLoader.loadFileLocal(file);
    }
    const fileParsed: any = xml2js(fileGui.contents);
    return this.findElements({}, fileParsed.elements);
  }

  async setupInfo() {
    const info: Element = this.tabs.getElementsByClassName("panel")[0];
    info.replaceChildren();
    const fileXml: any = await this.loadXml(this.instrument.AriaGUI[0].path);
    info.appendChild(this.addImage(fileXml.StaticImage[0]));
  }

  async setupControls() {
    const controls: Element = this.tabs.getElementsByClassName("panel")[1];
    controls.replaceChildren();
    const fileProgram: any = await this.loadXml(
      this.instrument.AriaProgram[0].gui
    );
    if (fileProgram.Knob)
      fileProgram.Knob.forEach((knob: PlayerKnob) =>
        controls.appendChild(this.addControl(PlayerElements.Knob, knob))
      );
    if (fileProgram.OnOffButton)
      fileProgram.OnOffButton.forEach((button: PlayerButton) =>
        controls.appendChild(this.addControl(PlayerElements.Switch, button))
      );
    if (fileProgram.Slider)
      fileProgram.Slider.forEach((slider: PlayerSlider) =>
        controls.appendChild(this.addControl(PlayerElements.Slider, slider))
      );
    if (fileProgram.StaticImage)
      fileProgram.StaticImage.forEach((image: PlayerImage) =>
        controls.appendChild(this.addImage(image))
      );
    if (fileProgram.StaticText)
      fileProgram.StaticText.forEach((text: PlayerText) =>
        controls.appendChild(this.addText(text))
      );
  }

  addKeyboard() {
    const keys: HTMLElement = document.createElement("webaudio-keyboard");
    keys.setAttribute("keys", "88");
    keys.setAttribute("height", "70");
    keys.setAttribute("width", "775");
    this.getEl().appendChild(keys);
  }

  addImage(image: PlayerImage) {
    const img: HTMLImageElement = document.createElement("img");
    img.setAttribute("draggable", "false");
    img.setAttribute(
      "style",
      `left: ${image.x}px; top: ${image.y}px; height: ${image.h}px; width: ${image.w}px`
    );
    img.setAttribute("src", this.basepath + "/GUI/" + image.image);
    return img;
  }

  addControl(type: PlayerElements, element: PlayerElement) {
    const el: any = document.createElement(`webaudio-${type}`);
    if ("image" in element)
      el.setAttribute("src", this.basepath + "/GUI/" + element.image);
    if ("image_bg" in element)
      el.setAttribute("src", this.basepath + "/GUI/" + element.image_bg);
    if ("image_handle" in element)
      el.setAttribute(
        "knobsrc",
        this.basepath + "/GUI/" + element.image_handle
      );
    if ("frames" in element) {
      el.setAttribute("value", "0");
      el.setAttribute("max", Number(element.frames) - 1);
      el.setAttribute("step", "1");
      el.setAttribute("sprites", Number(element.frames) - 1);
      el.setAttribute("tooltip", "%d");
    }
    if ("orientation" in element) {
      const dir: string = element.orientation === "vertical" ? "vert" : "horz";
      el.setAttribute("direction", dir);
    }
    if ("x" in element) {
      el.setAttribute("style", `left: ${element.x}px; top: ${element.y}px`);
    }
    if ("w" in element) {
      el.setAttribute("height", element.h);
      el.setAttribute("width", element.w);
    }
    return el;
  }

  addText(text: PlayerText) {
    const span: HTMLSpanElement = document.createElement("span");
    span.setAttribute(
      "style",
      `left: ${text.x}px; top: ${text.y}px; color: ${text.color_text}; height: ${text.h}px; width: ${text.w}px`
    );
    span.innerHTML = text.text;
    return span;
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

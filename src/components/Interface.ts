import './Interface.scss';
import { xml2js } from 'xml-js';
import { InterfaceOptions } from '../types/player';
import Component from './component';
import { FileLocal, FileRemote } from '../types/files';
import {
  PlayerButton,
  PlayerElement,
  PlayerElements,
  PlayerImage,
  PlayerKnob,
  PlayerSlider,
  PlayerText,
} from '../types/interface';
import FileLoader from '../utils/fileLoader';
import { AudioControlEvent, AudioKeyboardMap } from '../types/audio';

class Interface extends Component {
  private width: number = 775;
  private height: number = 330;
  private keyboard: any;
  private keyboardMap: AudioKeyboardMap = {};
  private instrument: { [name: string]: any[] } = {};
  private loadingScreen: HTMLDivElement;
  private tabs: HTMLDivElement;
  loader: FileLoader;

  constructor(options: InterfaceOptions) {
    super('interface');

    this.tabs = document.createElement('div');
    this.tabs.className = 'tabs';
    this.addTab('Info');
    this.addTab('Controls');
    this.getEl().appendChild(this.tabs);
    this.addKeyboard();

    this.loadingScreen = document.createElement('div');
    this.loadingScreen.className = 'loadingScreen';
    this.getEl().appendChild(this.loadingScreen);

    if (options.loader) {
      this.loader = options.loader;
    } else {
      this.loader = new FileLoader();
    }
    if (options.root) this.loader.setRoot(options.root);
    if (options.directory) this.loader.addDirectory(options.directory);
    if (options.file) {
      const file: FileLocal | FileRemote | undefined = this.loader.addFile(options.file);
      this.showFile(file);
    } else {
      this.reset();
    }
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    file = await this.loader.getFile(file);
    this.instrument = this.parseXML(file);
    this.render();
  }

  render() {
    this.setupInfo();
    this.setupControls();
  }

  toPercentage(val1: string, val2: number) {
    return Math.min(Number(val1) / val2, 1) * 100 + '%';
  }

  toRelative(element: PlayerElement) {
    return {
      left: this.toPercentage(element.x, this.width),
      top: this.toPercentage(element.y, this.height),
      width: this.toPercentage(element.w, this.width),
      height: this.toPercentage(element.h, this.height),
    };
  }

  async addImage(image: PlayerImage) {
    const relative: any = this.toRelative(image);
    const img: HTMLImageElement = document.createElement('img');
    img.setAttribute('draggable', 'false');
    img.setAttribute(
      'style',
      `left: ${relative.left}; top: ${relative.top}; width: ${relative.width}; height: ${relative.height};`
    );
    await this.addImageAtr(img, 'src', image.image);
    return img;
  }

  async addImageAtr(img: HTMLImageElement, attribute: string, path: string) {
    if (this.loader.root.startsWith('http')) {
      img.setAttribute(attribute, this.loader.root + 'GUI/' + path);
    } else {
      const file: FileRemote | undefined = this.loader.files['GUI/' + path];
      if (file && 'handle' in file) {
        img.setAttribute(attribute, URL.createObjectURL(file.handle as Blob));
      }
    }
  }

  addControl(type: PlayerElements, element: PlayerElement) {
    const relative: any = this.toRelative(element);
    const el: any = document.createElement(`webaudio-${type}`);
    if ('image' in element) this.addImageAtr(el, 'src', element.image);
    if ('image_bg' in element) this.addImageAtr(el, 'src', element.image_bg);
    if ('image_handle' in element) this.addImageAtr(el, 'knobsrc', element.image_handle);
    if ('frames' in element) {
      el.setAttribute('value', '0');
      el.setAttribute('max', Number(element.frames) - 1);
      el.setAttribute('step', '1');
      el.setAttribute('sprites', Number(element.frames) - 1);
      el.setAttribute('tooltip', '%d');
    }
    if ('orientation' in element) {
      const dir: string = element.orientation === 'vertical' ? 'vert' : 'horz';
      el.setAttribute('direction', dir);
    }
    if ('x' in element) {
      el.setAttribute('style', `left: ${relative.left}; top: ${relative.top};`);
    }
    if ('w' in element) {
      el.setAttribute('height', element.h);
      el.setAttribute('width', element.w);
    }
    return el;
  }

  addKeyboard() {
    const keyboard: any = document.createElement('webaudio-keyboard');
    keyboard.setAttribute('keys', '88');
    keyboard.setAttribute('height', '70');
    keyboard.setAttribute('width', '775');
    
    // Debounce rapid events to prevent immediate note-off
    let lastNoteTime: Map<number, number> = new Map();
    let eventTimeouts: Map<number, any> = new Map();
    
    keyboard.addEventListener('change', (event: any) => {
      console.log('🎹 Keyboard raw event:', event, 'note array:', event.note);
      
      const noteNumber = event.note[1];
      const isNoteOn = event.note[0] === 1;
      const currentTime = Date.now();
      
      // For note-on events, clear any pending note-off timeout
      if (isNoteOn) {
        const timeoutId = eventTimeouts.get(noteNumber);
        if (timeoutId) {
          clearTimeout(timeoutId);
          eventTimeouts.delete(noteNumber);
        }
      }
      
      // For note-off events, add a small delay to ensure note-on is processed first
      if (!isNoteOn) {
        const timeSinceLastOn = currentTime - (lastNoteTime.get(noteNumber) || 0);
        
        // If note-off comes too quickly after note-on (< 10ms), delay it slightly
        if (timeSinceLastOn < 10) {
          const timeoutId = setTimeout(() => {
            const controlEvent: AudioControlEvent = {
              channel: 1,
              note: noteNumber,
              velocity: 0,
            };
            console.log('🎹 Keyboard controlEvent (delayed):', controlEvent);
            this.dispatchEvent('change', controlEvent);
            eventTimeouts.delete(noteNumber);
          }, 10);
          
          eventTimeouts.set(noteNumber, timeoutId);
          return;
        }
      } else {
        lastNoteTime.set(noteNumber, currentTime);
      }
      
      const controlEvent: AudioControlEvent = {
        channel: 1,
        note: noteNumber,
        velocity: isNoteOn ? 100 : 0,
      };
      
      console.log('🎹 Keyboard controlEvent:', controlEvent);
      this.dispatchEvent('change', controlEvent);
    });
    
    this.getEl().appendChild(keyboard);
    this.keyboard = keyboard;
    window.addEventListener('resize', () => this.resizeKeyboard());
    window.setTimeout(() => this.resizeKeyboard());
  }

  resizeKeyboard() {
    const keyboardMapKeys: string[] = Object.keys(this.keyboardMap);
    const keyStart: number = Number(keyboardMapKeys[0]);
    const keyEnd: number = Number(keyboardMapKeys[keyboardMapKeys.length - 1]);
    const keysFit: number = Math.floor(this.getEl().clientWidth / 13);
    const keysRange: number = keyEnd - keyStart;
    const keysDiff: number = Math.floor(keysFit / 2 - keysRange / 2);
    this.keyboard.min = Math.max(keyStart - keysDiff, 0);
    this.keyboard.keys = keysFit;
    this.keyboard.width = this.getEl().clientWidth;
    for (let i = 0; i < 200; i += 1) {
      this.keyboard.setdisabledvalues(!this.keyboardMap[i], Number(i));
    }
    this.keyboard.redraw();
  }

  setKeyboard(event: AudioControlEvent) {
    this.keyboard.setNote(event.velocity, event.note);
  }

  /**
   * Handle CC events - particularly sustain pedal (CC64)
   */
  handleCC(ccNumber: number, ccValue: number) {
    // Dispatch CC event to be handled by the player
    const ccEvent: any = {
      type: 'cc',
      ccNumber: ccNumber,
      ccValue: ccValue
    };
    this.dispatchEvent('cc', ccEvent);
  }

  setLoadingState(loading: boolean) {
    if (loading) this.getEl().classList.add('loading');
    else this.getEl().classList.remove('loading');
  }

  setKeyboardMap(map: AudioKeyboardMap) {
    this.keyboardMap = map;
    this.resizeKeyboard();
  }

  setLoadingText(text: string) {
    this.loadingScreen.innerHTML = text;
  }

  addTab(name: string) {
    const input: HTMLInputElement = document.createElement('input');
    input.className = 'radiotab';
    if (name === 'Info') input.setAttribute('checked', 'checked');
    input.type = 'radio';
    input.id = name.toLowerCase();
    input.name = 'tabs';
    this.tabs.appendChild(input);

    const label: HTMLLabelElement = document.createElement('label');
    label.className = 'label';
    label.setAttribute('for', name.toLowerCase());
    label.innerHTML = name;
    this.tabs.appendChild(label);

    const div: HTMLDivElement = document.createElement('div');
    div.className = 'panel';
    this.tabs.appendChild(div);
  }

  addText(text: PlayerText) {
    const relative: any = this.toRelative(text);
    const span: HTMLSpanElement = document.createElement('span');
    span.setAttribute(
      'style',
      `left: ${relative.left}; top: ${relative.top}; width: ${relative.width}; height: ${relative.height}; color: ${text.color_text};`
    );
    span.innerHTML = text.text;
    return span;
  }

  parseXML(file: FileLocal | FileRemote | undefined) {
    if (!file) return {};
    const fileParsed: any = xml2js(file.contents);
    return this.findElements({}, fileParsed.elements);
  }

  reset(title?: string) {
    const panels: HTMLCollectionOf<Element> = this.tabs.getElementsByClassName('panel');
    for (const panel of panels) {
      panel.replaceChildren();
    }
    const info: Element = this.tabs.getElementsByClassName('panel')[0];
    const span: HTMLSpanElement = document.createElement('span');
    span.className = 'default-title';
    span.innerHTML = title || 'sfz instrument';
    info.appendChild(span);
  }

  async setupInfo() {
    if (!this.instrument.AriaGUI) return;
    const info: Element = this.tabs.getElementsByClassName('panel')[0];
    info.replaceChildren();
    const file: FileLocal | FileRemote | undefined = await this.loader.getFile(
      this.loader.root + this.instrument.AriaGUI[0].path
    );
    const fileXml: any = await this.parseXML(file);
    info.appendChild(await this.addImage(fileXml.StaticImage[0]));
  }

  async setupControls() {
    if (!this.instrument.AriaProgram) return;
    const controls: Element = this.tabs.getElementsByClassName('panel')[1];
    controls.replaceChildren();
    const file: FileLocal | FileRemote | undefined = await this.loader.getFile(
      this.loader.root + this.instrument.AriaProgram[0].gui
    );
    const fileXml: any = await this.parseXML(file);
    if (fileXml.Knob)
      fileXml.Knob.forEach((knob: PlayerKnob) => controls.appendChild(this.addControl(PlayerElements.Knob, knob)));
    if (fileXml.OnOffButton)
      fileXml.OnOffButton.forEach((button: PlayerButton) =>
        controls.appendChild(this.addControl(PlayerElements.Switch, button))
      );
    if (fileXml.Slider)
      fileXml.Slider.forEach((slider: PlayerSlider) =>
        controls.appendChild(this.addControl(PlayerElements.Slider, slider))
      );
    if (fileXml.StaticImage)
      fileXml.StaticImage.forEach(async (image: PlayerImage) => controls.appendChild(await this.addImage(image)));
    if (fileXml.StaticText) fileXml.StaticText.forEach((text: PlayerText) => controls.appendChild(this.addText(text)));
    window.addEventListener('resize', () => this.resizeControls());
    window.setTimeout(() => this.resizeControls());
  }

  resizeControls() {
    const width: number = Math.floor(this.getEl().clientWidth / 25);
    const sliderWidth: number = Math.floor(this.getEl().clientWidth / 65);
    const sliderHeight: number = Math.floor(this.getEl().clientHeight / 3.5);
    const controls: Element = this.tabs.getElementsByClassName('panel')[1];
    controls.childNodes.forEach((control: any) => {
      if (control.nodeName === 'WEBAUDIO-KNOB' || control.nodeName === 'WEBAUDIO-SWITCH') {
        control.width = control.height = width;
      } else if (control.nodeName === 'WEBAUDIO-SLIDER') {
        control.width = sliderWidth;
        control.height = sliderHeight;
      }
    });
  }

  findElements(list: { [name: string]: any[] }, nodes: any[]) {
    nodes.forEach((node: any) => {
      if (node.type === 'element') {
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

export default Interface;

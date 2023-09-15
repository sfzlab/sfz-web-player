import {
  AudioOptions,
  EditorOptions,
  HeaderOptions,
  HeaderPreset,
  InterfaceOptions,
  PlayerOptions,
} from '../types/player';
import Component from './component';
import Editor from './Editor';
import Interface from './Interface';
import './Player.scss';
import { directoryOpen, FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { pathDir, pathExt, pathRoot } from '../utils/utils';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import Audio from './Audio';
import { EventData } from '../types/event';
import { getJSON } from '../utils/api';

class Player extends Component {
  private audio?: Audio;
  private editor?: Editor;
  private interface?: Interface;
  public loader: FileLoader;

  constructor(id: string, options: PlayerOptions) {
    super('player');
    this.loader = new FileLoader();
    if (options.audio) this.setupAudio(options.audio);
    if (options.header) this.setupHeader(options.header);
    if (options.interface) this.setupInterface(options.interface);
    if (options.editor) this.setupEditor(options.editor);
    document.getElementById(id)?.appendChild(this.getEl());
    if (options.instrument) {
      this.loadRemoteInstrument(options.instrument);
    }
  }

  setupAudio(options: AudioOptions) {
    options.loader = this.loader;
    this.audio = new Audio(options);
    this.audio.addEvent('change', (event: EventData) => {
      if (this.interface) this.interface.setKeyboard(event.data);
    });
    this.audio.addEvent('keyboardMap', (event: EventData) => {
      if (this.interface) this.interface.setKeyboardMap(event.data);
    });
    this.audio.addEvent('preload', (event: EventData) => {
      if (this.interface) this.interface.setLoadingText(event.data.status);
    });
    this.audio.addEvent('loading', (event: EventData) => {
      if (this.interface) this.interface.setLoadingState(event.data);
    });
  }

  setupInterface(options: InterfaceOptions) {
    options.loader = this.loader;
    this.interface = new Interface(options);
    this.interface.addEvent('change', (event: EventData) => {
      if (this.audio) this.audio.update(event.data);
    });
    this.getEl().appendChild(this.interface.getEl());
    this.interface.setLoadingState(true);
  }

  setupEditor(options: EditorOptions) {
    options.loader = this.loader;
    this.editor = new Editor(options);
    this.getEl().appendChild(this.editor.getEl());
  }

  setupHeader(options: HeaderOptions) {
    const div: HTMLDivElement = document.createElement('div');
    div.className = 'header';

    if (options.local) {
      const inputLocal: HTMLInputElement = document.createElement('input');
      inputLocal.type = 'button';
      inputLocal.value = 'Local directory';
      inputLocal.addEventListener('click', async (e) => {
        await this.loadLocalInstrument();
      });
      div.appendChild(inputLocal);
    }
    if (options.remote) {
      const inputRemote: HTMLInputElement = document.createElement('input');
      inputRemote.type = 'button';
      inputRemote.value = 'Remote directory';
      inputRemote.addEventListener('click', async (e) => {
        const repo: string | null = window.prompt('Enter a GitHub owner/repo', 'studiorack/black-and-green-guitars');
        if (repo) await this.loadRemoteInstrument(repo);
      });
      div.appendChild(inputRemote);
    }
    if (options.presets) {
      const inputPresets: HTMLSelectElement = document.createElement('select');
      options.presets.forEach((preset: HeaderPreset) => {
        const inputOption: HTMLOptionElement = document.createElement('option');
        inputOption.innerHTML = preset.name;
        if (preset.selected) inputOption.selected = true;
        inputPresets.appendChild(inputOption);
      });
      inputPresets.addEventListener('change', async (e) => {
        const preset: HeaderPreset = options.presets[inputPresets.selectedIndex];
        await this.loadRemoteInstrument(preset.id);
      });
      div.appendChild(inputPresets);
    }

    this.getEl().appendChild(div);
  }

  async loadLocalInstrument() {
    try {
      const blobs: FileWithDirectoryAndFileHandle[] = (await directoryOpen({
        recursive: true,
      })) as FileWithDirectoryAndFileHandle[];
      console.log(`${blobs.length} files selected.`);
      this.loadDirectory(pathRoot(blobs[0].webkitRelativePath), blobs);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log('The user aborted a request.');
    }
  }

  async loadRemoteInstrument(repo: string) {
    const response: any = await getJSON(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`);
    const paths: string[] = response.tree.map(
      (file: any) => `https://raw.githubusercontent.com/${repo}/main/${file.path}`
    );
    await this.loadDirectory(`https://raw.githubusercontent.com/${repo}/main/`, paths);
  }

  async loadDirectory(root: string, files: string[] | FileWithDirectoryAndFileHandle[]) {
    let audioFile: string | FileWithDirectoryAndFileHandle | undefined;
    let audioFileDepth: number = 1000;
    let interfaceFile: string | FileWithDirectoryAndFileHandle | undefined;
    let interfaceFileDepth: number = 1000;
    for (const file of files) {
      const path: string = typeof file === 'string' ? file : file.webkitRelativePath;
      const depth: number = path.match(/\//g)?.length || 0;
      if (pathExt(path) === 'sfz' && depth < audioFileDepth) {
        audioFile = file;
        audioFileDepth = depth;
      }
      if (pathExt(path) === 'xml' && depth < interfaceFileDepth) {
        interfaceFile = file;
        interfaceFileDepth = depth;
      }
    }
    console.log('audioFile', audioFile);
    console.log('interfaceFile', interfaceFile);
    this.loader.resetFiles();
    this.loader.setRoot(root);
    this.loader.addDirectory(files);

    if (this.interface) {
      if (interfaceFile) {
        const file: FileLocal | FileRemote | undefined = this.interface.loader.addFile(interfaceFile);
        await this.interface.showFile(file);
        this.interface.render();
      } else {
        this.interface.reset();
      }
    }
    if (this.editor) {
      const defaultFile: string | FileWithDirectoryAndFileHandle | undefined = audioFile || interfaceFile;
      if (defaultFile) {
        const file: FileLocal | FileRemote | undefined = this.editor.loader.addFile(defaultFile);
        await this.editor.showFile(file);
        this.editor.render();
      } else {
        this.editor.reset();
      }
    }
    if (this.audio) {
      if (audioFile) {
        const file: FileLocal | FileRemote | undefined = this.audio.loader.addFile(audioFile);
        await this.audio.showFile(file);
      } else {
        this.audio.reset();
      }
    }
  }
}

export default Player;

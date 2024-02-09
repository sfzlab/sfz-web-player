import { AudioOptions, EditorOptions, HeaderOptions, HeaderPreset, InterfaceOptions, PlayerOptions } from '../types/player';
import Component from './component';
import './Player.scss';
import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import FileLoader from '../utils/fileLoader';
declare class Player extends Component {
    private audio?;
    private editor?;
    private interface?;
    loader: FileLoader;
    constructor(id: string, options: PlayerOptions);
    setupAudio(options: AudioOptions): void;
    setupInterface(options: InterfaceOptions): void;
    setupEditor(options: EditorOptions): void;
    setupHeader(options: HeaderOptions): void;
    loadLocalInstrument(): Promise<void>;
    loadRemoteInstrument(preset: HeaderPreset): Promise<void>;
    loadDirectory(root: string, files: string[] | FileWithDirectoryAndFileHandle[]): Promise<void>;
}
export default Player;

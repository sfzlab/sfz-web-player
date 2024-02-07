import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import FileLoader from '../utils/fileLoader';

interface AudioOptions {
  file?: string | FileWithDirectoryAndFileHandle;
  loader?: FileLoader;
  root?: string;
}

interface EditorOptions {
  directory?: string[] | FileWithDirectoryAndFileHandle[];
  file?: string | FileWithDirectoryAndFileHandle;
  loader?: FileLoader;
  root?: string;
}

interface HeaderOptions {
  local?: boolean;
  remote?: boolean;
  presets: HeaderPreset[];
}

interface HeaderPreset {
  branch?: string;
  name: string;
  id: string;
  selected?: boolean;
}

interface InterfaceOptions {
  directory?: string[] | FileWithDirectoryAndFileHandle[];
  file?: string | FileWithDirectoryAndFileHandle;
  loader?: FileLoader;
  root?: string;
}

interface PlayerOptions {
  audio?: AudioOptions;
  editor?: EditorOptions;
  header?: HeaderOptions;
  instrument?: HeaderPreset;
  interface?: InterfaceOptions;
}

export { AudioOptions, EditorOptions, HeaderOptions, HeaderPreset, InterfaceOptions, PlayerOptions };

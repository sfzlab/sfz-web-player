import { FileWithDirectoryAndFileHandle } from "browser-fs-access";

interface EditorOptions {
  directory?: string[] | FileWithDirectoryAndFileHandle[];
  file?: string | FileWithDirectoryAndFileHandle;
}

interface InterfaceOptions {
  file?: string;
}

interface PlayerOptions {
  audio?: boolean;
  editor?: EditorOptions;
  header?: boolean;
  interface?: InterfaceOptions;
}

export { EditorOptions, InterfaceOptions, PlayerOptions };

import { FileWithDirectoryAndFileHandle } from "browser-fs-access";
import FileLoader from "../utils/fileLoader";
interface EditorOptions {
    directory?: string[] | FileWithDirectoryAndFileHandle[];
    file?: string | FileWithDirectoryAndFileHandle;
    loader?: FileLoader;
    root?: string;
}
interface InterfaceOptions {
    directory?: string[] | FileWithDirectoryAndFileHandle[];
    file?: string | FileWithDirectoryAndFileHandle;
    loader?: FileLoader;
    root?: string;
}
interface PlayerOptions {
    audio?: boolean;
    editor?: EditorOptions;
    header?: boolean;
    interface?: InterfaceOptions;
}
export { EditorOptions, InterfaceOptions, PlayerOptions };

import { FileWithDirectoryAndFileHandle } from "browser-fs-access";
import { FileLocal, FileRemote, FilesMap, FilesTree } from "../types/files";
declare class FileLoader {
    audio: AudioContext;
    files: FilesMap;
    filesTree: FilesTree;
    root: string;
    addDirectory(files: string[] | FileWithDirectoryAndFileHandle[]): void;
    addFile(file: string | FileWithDirectoryAndFileHandle): FileRemote | undefined;
    loadFile(file: string | FileWithDirectoryAndFileHandle, buffer?: boolean): Promise<FileRemote>;
    getFile(file: string | FileLocal | FileRemote | undefined, buffer?: boolean): Promise<FileRemote | undefined>;
    setRoot(dir: string): void;
    resetFiles(): void;
}
export default FileLoader;

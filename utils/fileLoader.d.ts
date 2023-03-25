import { FileWithDirectoryAndFileHandle } from "browser-fs-access";
import { FileLocal, FileRemote, FilesMap, FilesTree } from "../types/files";
declare class FileLoader {
    files: FilesMap;
    filesTree: FilesTree;
    root: string;
    addDirectory(files: string[] | FileWithDirectoryAndFileHandle[]): void;
    addFile(file: string | FileWithDirectoryAndFileHandle): FileRemote | undefined;
    loadFile(file: string | FileWithDirectoryAndFileHandle): Promise<FileRemote>;
    getFile(file: string | FileLocal | FileRemote | undefined): Promise<FileRemote | undefined>;
    setRoot(dir: string): void;
    resetFiles(): void;
}
export default FileLoader;

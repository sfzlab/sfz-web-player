import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { FileLocal, FileRemote, FilesMap, FilesTree } from '../types/files';
declare class FileLoader {
    audio: AudioContext | undefined;
    files: FilesMap;
    filesTree: FilesTree;
    root: string;
    constructor();
    addDirectory(files: string[] | FileWithDirectoryAndFileHandle[]): void;
    addFile(file: string | FileWithDirectoryAndFileHandle): FileRemote | undefined;
    addToFileTree(key: string): void;
    loadFileLocal(file: FileLocal, buffer?: boolean): Promise<FileLocal>;
    loadFileRemote(file: FileRemote, buffer?: boolean): Promise<FileRemote>;
    getFile(file: string | FileLocal | FileRemote | undefined, buffer?: boolean): Promise<FileRemote | undefined>;
    setRoot(dir: string): void;
    resetFiles(): void;
}
export default FileLoader;

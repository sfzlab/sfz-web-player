import { FileGitHubItem, FileItem, FilesMap, FilesNested } from "../types/files";
declare class FileLoader {
    private branch;
    private files;
    private filesNested;
    private directory;
    getFiles(): FilesMap;
    loadFileLocal(file: File): Promise<FileItem>;
    loadFileRemote(file: FileGitHubItem): Promise<FileItem>;
    loadDirectoryLocal(blobs: File[]): Promise<{
        branch: string;
        directory: string;
        files: FilesMap;
        filesNested: FilesNested;
    }>;
    loadDirectoryRemote(data: any): Promise<{
        branch: string;
        directory: string;
        files: FilesMap;
        filesNested: FilesNested;
    }>;
}
export default FileLoader;

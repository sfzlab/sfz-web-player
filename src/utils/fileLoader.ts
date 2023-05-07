import { FileWithDirectoryAndFileHandle } from "browser-fs-access";
import { FileLocal, FileRemote, FilesMap, FilesTree } from "../types/files";
import { get, getRaw } from "./api";
import { encodeHashes, pathExt, pathSubDir } from "./utils";

class FileLoader {
  audio: AudioContext = new AudioContext();
  files: FilesMap = {};
  filesTree: FilesTree = {};
  root: string = "";

  addDirectory(files: string[] | FileWithDirectoryAndFileHandle[]) {
    this.resetFiles();
    files.forEach((file: string | FileWithDirectoryAndFileHandle) =>
      this.addFile(file)
    );
  }

  addFile(file: string | FileWithDirectoryAndFileHandle) {
    const path: string = decodeURI(
      typeof file === "string" ? file : file.webkitRelativePath
    );
    if (path === this.root) return;
    const fileKey: string = pathSubDir(path, this.root);
    if (typeof file === "string") {
      this.files[fileKey] = {
        ext: pathExt(file),
        contents: null,
        path,
      };
    } else {
      this.files[fileKey] = {
        ext: pathExt(file.webkitRelativePath),
        contents: null,
        path,
        handle: file,
      };
    }
    this.addToFileTree(fileKey);
    return this.files[fileKey];
  }

  addToFileTree(key: string) {
    key
      .split("/")
      .reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesTree);
  }

  async loadFileLocal(file: FileLocal, buffer = false) {
    if (buffer === true) {
      const arrayBuffer: ArrayBuffer = await file.handle.arrayBuffer();
      file.contents = await this.audio.decodeAudioData(arrayBuffer);
      return file;
    }
    file.contents = await file.handle.text();
    return file;
  }

  async loadFileRemote(file: FileRemote, buffer = false) {
    if (buffer === true) {
      const arrayBuffer: ArrayBuffer = await getRaw(encodeHashes(file.path));
      file.contents = await this.audio.decodeAudioData(arrayBuffer);
      return file;
    }
    file.contents = await get(encodeHashes(file.path));
    return file;
  }

  async getFile(
    file: string | FileLocal | FileRemote | undefined,
    buffer = false
  ) {
    if (!file) return;
    if (typeof file === "string") {
      if (pathExt(file).length === 0) return;
      const fileKey: string = pathSubDir(file, this.root);
      const fileRef: FileLocal = this.files[fileKey] as FileLocal;
      if (file.startsWith("http"))
        return await this.loadFileRemote(fileRef, buffer);
      return await this.loadFileLocal(fileRef, buffer);
    }
    if ("handle" in file) return await this.loadFileLocal(file, buffer);
    return await this.loadFileRemote(file, buffer);
  }

  setRoot(dir: string) {
    this.root = dir;
  }

  resetFiles() {
    this.files = {};
    this.filesTree = {};
  }
}

export default FileLoader;

import { FileWithDirectoryAndFileHandle } from "browser-fs-access";
import { FileLocal, FileRemote, FilesMap, FilesTree } from "../types/files";
import { get } from "./api";
import { pathDir, pathExt, pathRoot, pathSubDir } from "./utils";

class FileLoader {
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
    let item: FileLocal | FileRemote;
    if (typeof file === "string") {
      if (file === this.root) return;
      item = {
        ext: pathExt(file),
        contents: null,
        path: decodeURI(file),
      };
    } else {
      item = {
        ext: pathExt(file.webkitRelativePath),
        contents: null,
        path: decodeURI(file.webkitRelativePath),
        handle: file,
      };
    }
    const fileKey: string = pathSubDir(item.path, this.root);
    this.files[fileKey] = item;
    fileKey
      .split("/")
      .reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesTree);
    return item;
  }

  async loadFile(file: string | FileWithDirectoryAndFileHandle) {
    if (typeof file === "string") {
      return {
        ext: pathExt(file),
        contents: await get(file),
        path: decodeURI(file),
      } as FileRemote;
    } else {
      return {
        ext: pathExt(file.webkitRelativePath),
        contents: await file.text(),
        path: file.webkitRelativePath,
      } as FileLocal;
    }
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

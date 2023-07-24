import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { readFileSync } from 'fs';
import { FileLocal, FileRemote, FilesMap, FilesTree } from '../types/files';
import { get, getRaw } from './api';
import { encodeHashes, pathExt, pathSubDir } from './utils';

class FileLoader {
  audio: AudioContext | undefined;
  files: FilesMap = {};
  filesTree: FilesTree = {};
  root: string = '';

  constructor() {
    if (window.AudioContext) {
      this.audio = new window.AudioContext();
    }
  }

  addDirectory(files: string[] | FileWithDirectoryAndFileHandle[]) {
    files.forEach((file: string | FileWithDirectoryAndFileHandle) => this.addFile(file));
  }

  addFile(file: string | FileWithDirectoryAndFileHandle) {
    const path: string = decodeURI(typeof file === 'string' ? file : file.webkitRelativePath);
    if (path === this.root) return;
    const fileKey: string = pathSubDir(path, this.root);
    if (typeof file === 'string') {
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

  addFileContents(file: string, contents: any) {
    const path: string = decodeURI(file);
    const fileKey: string = pathSubDir(path, this.root);
    this.files[fileKey] = {
      ext: pathExt(path),
      contents,
      path,
    };
    return this.files[fileKey];
  }

  addFilesContents(directory: string, filenames: string[]) {
    filenames.forEach((filename: string) => {
      this.addFileContents(directory + filename, readFileSync(directory + filename).toString());
    });
  }

  addToFileTree(key: string) {
    key.split('/').reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesTree);
  }

  async loadFileLocal(file: FileLocal, buffer = false) {
    if (buffer === true) {
      const arrayBuffer: ArrayBuffer = await file.handle.arrayBuffer();
      if (this.audio && arrayBuffer) {
        file.contents = await this.audio.decodeAudioData(arrayBuffer);
      }
    } else if (file.handle) {
      file.contents = await file.handle.text();
    }
    return file;
  }

  async loadFileRemote(file: FileRemote, buffer = false) {
    if (buffer === true) {
      const arrayBuffer: ArrayBuffer = await getRaw(encodeHashes(file.path));
      if (this.audio) {
        file.contents = await this.audio.decodeAudioData(arrayBuffer);
      }
    } else {
      file.contents = await get(encodeHashes(file.path));
    }
    return file;
  }

  async getFile(file: string | FileLocal | FileRemote | undefined, buffer = false) {
    if (!file) return;
    if (typeof file === 'string') {
      if (pathExt(file).length === 0) return;
      const fileKey: string = pathSubDir(file, this.root);
      let fileRef: FileLocal | FileRemote | undefined = this.files[fileKey];
      if (!fileRef) fileRef = this.addFile(file);
      if (fileRef?.contents) return fileRef;
      if (file.startsWith('http')) return await this.loadFileRemote(fileRef as FileRemote, buffer);
      return await this.loadFileLocal(fileRef as FileLocal, buffer);
    }
    if (file.contents) return file;
    if ('handle' in file) return await this.loadFileLocal(file, buffer);
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

import { FileWithDirectoryAndFileHandle } from "browser-fs-access";

interface FilesMap {
  [name: string]: FileLocal | FileRemote;
}

interface FilesTree {
  [key: string]: FilesTree;
}

interface FileLocal {
  ext: string;
  contents: any;
  path: string;
  handle: FileWithDirectoryAndFileHandle;
}

interface FileRemote {
  ext: string;
  contents: any;
  path: string;
}

export { FileLocal, FileRemote, FilesMap, FilesTree };

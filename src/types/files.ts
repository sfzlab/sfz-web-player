import { FileWithDirectoryAndFileHandle } from "browser-fs-access";

interface FileGitHubItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

interface FilesMap {
  [name: string]: FileLocal | FileRemote;
}

interface FilesTree {
  [key: string]: FilesTree;
}

interface FileGitHub {
  sha: string;
  url: string;
  tree: FileGitHubItem[];
  truncated: boolean;
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

interface FileItem {
  ext: string;
  contents: any;
  path: string;
}

interface FileObject {
  branch: string;
  directory: string;
  files: FilesMap;
  filesNested: FilesTree;
}

export {
  FileGitHub,
  FileGitHubItem,
  FileItem,
  FileLocal,
  FileRemote,
  FilesMap,
  FilesTree,
  FileObject,
};

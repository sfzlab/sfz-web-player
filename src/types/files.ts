interface FileGitHubItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

interface FilesMap {
  [name: string]: FileGitHubItem | File;
}

interface FilesNested {
  [key: string]: FilesNested;
}

interface FileGitHub {
  sha: string;
  url: string;
  tree: FileGitHubItem[];
  truncated: boolean;
}

interface FileItem {
  ext: string;
  contents: string;
  path: string;
}

interface FileObject {
  branch: string;
  directory: string;
  files: FilesMap;
  filesNested: FilesNested;
}

export {
  FileGitHub,
  FileGitHubItem,
  FileItem,
  FilesMap,
  FilesNested,
  FileObject,
};

interface FileItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  url: string;
}

interface FilesNested {
  [key: string]: FilesNested;
}

interface FileTree {
  sha: string;
  url: string;
  tree: FileItem[];
  truncated: boolean;
}

export { FileItem, FilesNested, FileTree };

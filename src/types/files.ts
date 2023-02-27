interface FileItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  url: string;
}

interface FileTree {
  sha: string;
  url: string;
  tree: FileItem[];
  truncated: boolean;
}

export { FileItem, FileTree };

interface FileGitHubItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
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

export { FileGitHub, FileGitHubItem, FilesMap, FilesNested };

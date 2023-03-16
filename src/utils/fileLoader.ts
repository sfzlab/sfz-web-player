import { FileSystemHandlePermissionDescriptor } from "browser-fs-access";
import {
  FileGitHub,
  FileGitHubItem,
  FileItem,
  FileObject,
  FilesMap,
  FilesNested,
} from "../types/files";

class FileLoader {
  private branch: string = "main";
  private files: FilesMap = {};
  private filesNested: FilesNested = {};
  private directory: string = "none";

  getFiles() {
    return this.files;
  }

  async loadFileLocal(file: File): Promise<FileItem> {
    console.log("loadFileLocal", file);
    return {
      ext: file.webkitRelativePath.split(".").pop() || "none",
      contents: await file.text(),
      path: file.webkitRelativePath,
    };
  }

  async loadFileRemote(file: FileGitHubItem): Promise<FileItem> {
    console.log("loadFileRemote", file);
    const response: any = await fetch(file.url);
    return {
      ext: file.url.split(".").pop() || "none",
      contents: await response.text(),
      path: file.url,
    };
  }

  async loadDirectoryLocal(blobs: File[]) {
    this.files = {};
    this.filesNested = {};
    blobs
      .sort((a: any, b: any) => a.webkitRelativePath.localeCompare(b))
      .forEach((blob: any) => {
        const pathElements: string[] = blob.webkitRelativePath.split("/");
        this.directory = pathElements.shift() || "none"; // remove root path
        this.files[pathElements.join("/")] = blob;
        pathElements.reduce(
          (o: any, k: string) => (o[k] = o[k] || {}),
          this.filesNested
        );
      });
    console.log("loadDirectoryLocal", this.files, this.filesNested);
    return {
      branch: this.branch,
      directory: this.directory,
      files: this.files,
      filesNested: this.filesNested,
    };
  }

  async loadDirectoryRemote(data: any) {
    let response: any = await fetch(
      `https://api.github.com/repos/${data.repo}/git/trees/${this.branch}?recursive=1`
    );
    // TODO write this properly.
    if (!response.ok) {
      this.branch = "master";
      response = await fetch(
        `https://api.github.com/repos/${data.repo}/git/trees/${this.branch}?recursive=1`
      );
    }
    const githubTree: FileGitHub = await response.json();
    this.files = {};
    this.filesNested = {};
    githubTree.tree.forEach((githubFile: FileGitHubItem) => {
      this.files[githubFile.path] = githubFile;
      githubFile.path
        .split("/")
        .reduce((o: any, k: string) => (o[k] = o[k] || {}), this.filesNested);
    });
    this.directory = data.repo;
    console.log("loadDirectoryRemote", this.files, this.filesNested);
    return {
      branch: this.branch,
      directory: this.directory,
      files: this.files,
      filesNested: this.filesNested,
    };
  }
}

export default FileLoader;

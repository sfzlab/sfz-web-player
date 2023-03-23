function pathGetDirectory(pathItem: string, separator: string = "/"): string {
  return pathItem.substring(0, pathItem.lastIndexOf(separator));
}

function pathGetSubDirectories(pathItem: string, pathDir: string): string {
  return pathItem.substring(pathDir.length);
}

function pathGetExt(pathItem: string): string {
  return pathItem.substring(pathItem.lastIndexOf(".") + 1);
}

export { pathGetDirectory, pathGetSubDirectories, pathGetExt };

function pathGetDirectory(pathItem: string, separator: string = "/"): string {
  return pathItem.substring(0, pathItem.lastIndexOf(separator) + 1);
}

function pathGetExt(pathItem: string): string {
  return pathItem.substring(pathItem.lastIndexOf(".") + 1);
}

function pathGetRoot(pathItem: string, separator: string = "/"): string {
  return pathItem.substring(0, pathItem.indexOf(separator) + 1);
}

function pathGetSubDirectories(pathItem: string, pathDir: string): string {
  return pathItem.substring(pathDir.length);
}

export { pathGetDirectory, pathGetExt, pathGetRoot, pathGetSubDirectories };

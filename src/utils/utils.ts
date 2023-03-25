function pathDir(item: string, separator: string = "/"): string {
  return item.substring(0, item.lastIndexOf(separator) + 1);
}

function pathExt(item: string): string {
  return item.substring(item.lastIndexOf(".") + 1);
}

function pathRoot(item: string, separator: string = "/"): string {
  return item.substring(0, item.indexOf(separator) + 1);
}

function pathSubDir(item: string, dir: string): string {
  return item.substring(dir.length);
}

export { pathDir, pathExt, pathRoot, pathSubDir };

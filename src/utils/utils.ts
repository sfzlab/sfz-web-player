function encodeHashes(item: string) {
  return item.replace(/#/g, encodeURIComponent('#'));
}

function pathDir(item: string, separator: string = '/'): string {
  return item.substring(0, item.lastIndexOf(separator) + 1);
}

function pathExt(item: string): string {
  return item.substring(item.lastIndexOf('.') + 1);
}

function pathJoin(...segments: any) {
  const parts = segments.reduce((partItems: any, segment: any) => {
    // Remove leading slashes from non-first part.
    if (partItems.length > 0) {
      segment = segment.replace(/^\//, '');
    }
    // Remove trailing slashes.
    segment = segment.replace(/\/$/, '');
    return partItems.concat(segment.split('/'));
  }, []);
  const resultParts = [];
  for (const part of parts) {
    if (part === '.') {
      continue;
    }
    if (part === '..') {
      const partRemoved: string = resultParts.pop();
      if (partRemoved === '') resultParts.pop();
      continue;
    }
    resultParts.push(part);
  }
  return resultParts.join('/');
}

function pathRoot(item: string, separator: string = '/'): string {
  return item.substring(0, item.indexOf(separator) + 1);
}

function pathSubDir(item: string, dir: string): string {
  return item.replace(dir, '');
}

export { encodeHashes, pathDir, pathExt, pathJoin, pathRoot, pathSubDir };

function encodeHashes(item: string) {
  return item.replace(/#/g, encodeURIComponent('#'));
}

function midiNameToNum(name: string | number) {
  if (!name) return 0;
  if (typeof name === 'number') return name;
  const mapPitches: any = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };
  const letter = name[0];
  let pc = mapPitches[letter.toUpperCase()];

  const mapMods: any = { b: -1, '#': 1 };
  const mod = name[1];
  const trans = mapMods[mod] || 0;

  pc += trans;

  const octave = parseInt(name.slice(name.length - 1), 10);
  if (octave) {
    return pc + 12 * (octave + 1);
  } else {
    return ((pc % 12) + 12) % 12;
  }
}

function pathDir(item: string, separator: string = '/'): string {
  return item.substring(0, item.lastIndexOf(separator) + 1);
}

function pathExt(item: string): string {
  return item.substring(item.lastIndexOf('.') + 1);
}

function pathJoin(...segments: any) {
  const parts = segments.reduce((partItems: any, segment: any) => {
    // Replace backslashes with forward slashes
    if (segment.includes('\\')) {
      segment = segment.replace(/\\/g, '/');
    }
    // Remove leading slashes from non-first part.
    if (partItems.length > 0) {
      segment = segment.replace(/^\//, '');
    }
    // Remove trailing slashes.
    segment = segment.replace(/\/$/, '');
    return partItems.concat(segment.split('/'));
  }, []);
  const resultParts = [];
  for (let part of parts) {
    if (part === 'https:') part += '/';
    if (part === '') continue;
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

export { encodeHashes, midiNameToNum, pathDir, pathExt, pathJoin, pathRoot, pathSubDir };

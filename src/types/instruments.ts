interface PluginEntry {
  id: string;
  license: string;
  version: string;
  versions: {
    [version: string]: PluginInterface;
  };
}

interface PluginFile {
  name: string;
  size: number;
}

interface PluginFiles {
  audio: PluginFile;
  image: PluginFile;
  linux: PluginFile;
  mac: PluginFile;
  win: PluginFile;
}

interface PluginInterface {
  author: string;
  date: string;
  description: string;
  homepage: string;
  id: string;
  name: string;
  files: PluginFiles;
  license?: PluginLicense;
  release: string;
  repo: string;
  tags: string[];
  type?: PluginType;
  version: string;
}

interface PluginLicense {
  key: string;
  name: string;
  url: string;
  same: boolean;
}

interface PluginPack {
  [property: string]: PluginEntry;
}

interface PluginType {
  name: string;
  ext: string;
}

export {
  PluginEntry,
  PluginFile,
  PluginFiles,
  PluginInterface,
  PluginLicense,
  PluginPack,
  PluginType,
};

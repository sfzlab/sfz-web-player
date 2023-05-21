import { AudioSfz, AudioSfzGlobal, AudioSfzGroup, AudioSfzRegion } from '../types/audio';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from './fileLoader';

let loader: FileLoader;

const DEBUG: boolean = false;
const skipCharacters: string[] = [' ', '\t', '\r', '\n'];
const endCharacters: string[] = ['>', '\r', '\n'];

async function parseSfz(prefix: string, contents: string) {
  let header: string = '';
  const map: any = {};
  let parent: any = map;
  let values: any = {};
  for (let i: number = 0; i < contents.length; i++) {
    const char: string = contents.charAt(i);
    if (skipCharacters.includes(char)) continue;
    const iEnd: number = findEnd(contents, i);
    const line: string = contents.slice(i, iEnd);
    if (char === '/') {
      // do nothing
    } else if (char === '#') {
      const matches: string[] = processDirective(line);
      // Need to handle define header
      if (matches[0] === 'include') {
        const fileRef: FileLocal | FileRemote | undefined = loader.files[prefix + matches[1]];
        const file: FileLocal | FileRemote | undefined = await loader.getFile(fileRef || prefix + matches[1]);
        const directiveValues: any = await parseSfz(prefix, file?.contents);
        const headerValues: any[] = parent[header];
        headerValues[headerValues.length - 1] = {
          ...headerValues[headerValues.length - 1],
          ...directiveValues,
        };
        if (DEBUG) console.log('headerValues', headerValues.length - 1, headerValues[headerValues.length - 1]);
      }
    } else if (char === '<') {
      const matches: string[] = processHeader(line);
      if (matches[0]) {
        header = matches[0];
        // TODO actually support master headers
        if (header === 'master') header = 'group';
        values = {};
        if (map.global) {
          if (header === 'group') parent = map.global[map.global.length - 1];
          else if (header === 'region')
            parent = map.global[map.global.length - 1].group[map.global[map.global.length - 1].group.length - 1];
          else parent = map;
        }
        if (!parent[header]) parent[header] = [];
        parent[header].push(values);
        if (DEBUG) console.log(`<${header}>`, values);
      }
    } else {
      const opcodeGroups: string[] = processOpcode(line);
      let opcodeName: string = '';
      for (let j = 0; j < opcodeGroups.length; j++) {
        if (j % 2 === 0) {
          opcodeName = opcodeGroups[j];
        } else {
          if (!isNaN(opcodeGroups[j] as any)) {
            values[opcodeName] = Number(opcodeGroups[j]);
          } else {
            values[opcodeName] = opcodeGroups[j];
          }
        }
      }
      if (DEBUG) console.log(opcodeGroups);
    }
    i = iEnd;
  }
  if (!header) return values;
  return map;
}

function processDirective(input: string) {
  return input.match(/[^#$ "]+/g) || [];
}

function processHeader(input: string) {
  return input.match(/[^< >]+/g) || [];
}

function processOpcode(input: string) {
  return input.split(/[= ]+/g) || [];
}

function flattenSfzObject(sfzObject: AudioSfz) {
  const keys: any = {};
  sfzObject.global?.forEach((global: AudioSfzGlobal) => {
    const valuesGlobal: any = { ...global };
    delete valuesGlobal.group;
    global.group?.forEach((group: AudioSfzGroup) => {
      const valuesGroup: any = { ...valuesGlobal, ...group };
      delete valuesGroup.region;
      group.region?.forEach((region: AudioSfzRegion) => {
        const valuesRegion: any = { ...valuesGroup, ...region };
        const start: number = valuesRegion.lokey || valuesRegion.key;
        const end: number = valuesRegion.hikey || valuesRegion.key;
        for (let i = start; i <= end; i++) {
          if (!keys[i]) keys[i] = [];
          keys[i].push(valuesRegion);
        }
      });
    });
  });
  return keys;
}

function findEnd(contents: string, startAt: number) {
  for (let index: number = startAt; index < contents.length; index++) {
    const char: string = contents.charAt(index);
    if (endCharacters.includes(char)) return index;
    if (char === '/' && contents.charAt(index + 1) === '/') return index;
  }
  return contents.length;
}

function setParserLoader(fileLoader: FileLoader) {
  loader = fileLoader;
}

export { flattenSfzObject, parseSfz, processDirective, processHeader, processOpcode, setParserLoader };

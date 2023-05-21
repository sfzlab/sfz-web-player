import { AudioSfz, AudioSfzGlobal, AudioSfzGroup, AudioSfzRegion, AudioSfzVariables } from '../types/audio';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from './fileLoader';

let loader: FileLoader;

const DEBUG: boolean = false;
const skipCharacters: string[] = [' ', '\t', '\r', '\n'];
const endCharacters: string[] = ['>', '\r', '\n'];
const variables: any = {};

async function parseSfz(prefix: string, contents: string) {
  let header: string = '';
  const map: any = {};
  let parent: any = map;
  let values: any = {};
  for (let i: number = 0; i < contents.length; i++) {
    const char: string = contents.charAt(i);
    if (skipCharacters.includes(char)) continue; // skip character
    const iEnd: number = findEnd(contents, i);
    let line: string = contents.slice(i, iEnd);
    if (char === '/') {
      // do nothing
    } else if (char === '#') {
      const matches: string[] = processDirective(line);
      // Need to handle define header
      if (matches[0] === 'include') {
        const includeVal: any = await loadParseSfz(prefix, matches[1]);
        const parentVal: any[] = parent[header];
        parentVal[parentVal.length - 1] = {
          ...parentVal[parentVal.length - 1],
          ...includeVal,
        };
        if (DEBUG) console.log('val', parentVal[parentVal.length - 1]);
      } else if (matches[0] === 'define') {
        variables[matches[1]] = matches[2];
        if (DEBUG) console.log('define', matches[1], variables[matches[1]]);
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
      if (line.includes('$')) line = processVariables(line, variables);
      const opcodeGroups: string[] = processOpcode(line);
      let opcodeName: string = '';
      let opcodeValue: any;
      for (let j = 0; j < opcodeGroups.length; j++) {
        opcodeValue = opcodeGroups[j];
        if (j % 2 === 0) {
          opcodeName = opcodeValue;
        } else {
          if (!isNaN(opcodeValue as any)) {
            values[opcodeName] = Number(opcodeValue);
          } else {
            values[opcodeName] = opcodeValue;
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

async function loadParseSfz(prefix: string, path: string) {
  const fileRef: FileLocal | FileRemote | undefined = loader.files[prefix + path];
  const file: FileLocal | FileRemote | undefined = await loader.getFile(fileRef || prefix + path);
  return await parseSfz(prefix, file?.contents);
}

function processDirective(input: string) {
  return input.match(/[^# "]+/g) || [];
}

function processHeader(input: string) {
  return input.match(/[^< >]+/g) || [];
}

function processOpcode(input: string) {
  return input.split(/[= ]+/g) || [];
}

function processVariables(input: string, vars: AudioSfzVariables) {
  const list: string = Object.keys(vars)
    .map((key) => '\\' + key)
    .join('|');
  const regEx: RegExp = new RegExp(list, 'g');
  return input.replace(regEx, (matched: string) => {
    return vars[matched];
  });
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

export {
  flattenSfzObject,
  parseSfz,
  processDirective,
  processHeader,
  processOpcode,
  processVariables,
  setParserLoader,
};

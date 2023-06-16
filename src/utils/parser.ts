import { AudioSfz, AudioSfzGlobal, AudioSfzGroup, AudioSfzRegion, AudioSfzVariables } from '../types/audio';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from './fileLoader';
import { midiNameToNum, pathJoin } from './utils';

let loader: FileLoader;

const DEBUG: boolean = false;
const skipCharacters: string[] = [' ', '\t', '\r', '\n'];
const endCharacters: string[] = ['>', '\r', '\n'];
const variables: any = {};

async function parseSfz(prefix: string, contents: string) {
  let header: string = '';
  const map: any = {};
  let values: any = [];
  for (let i: number = 0; i < contents.length; i++) {
    const char: string = contents.charAt(i);
    if (skipCharacters.includes(char)) continue; // skip character
    const iEnd: number = findEnd(contents, i);
    let line: string = contents.slice(i, iEnd);
    if (char === '/') {
      // do nothing
    } else if (char === '#') {
      const matches: string[] = processDirective(line);
      if (matches[0] === 'include') {
        const includeVal: any = await loadParseSfz(prefix, matches[1]);
        if (DEBUG) console.log('include', matches[1], includeVal);
      } else if (matches[0] === 'define') {
        variables[matches[1]] = matches[2];
        if (DEBUG) console.log('define', matches[1], variables[matches[1]]);
      }
    } else if (char === '<') {
      const matches: string[] = processHeader(line);
      header = matches[0];
      values = {};
      if (!map[header]) map[header] = { opcode: [] };
    } else {
      if (line.includes('$')) line = processVariables(line, variables);
      const opcodeGroups: any = processOpcode(line);
      if (header) {
        map[header].opcode = map[header].opcode.concat(opcodeGroups);
      } else {
        values = values.concat(opcodeGroups);
      }
      if (DEBUG) console.log(opcodeGroups);
    }
    i = iEnd;
  }
  if (!header) return map[header].opcode;
  return map;
}

async function loadParseSfz(prefix: string, suffix: string) {
  const pathJoined: string = pathJoin(prefix, suffix);
  const fileRef: FileLocal | FileRemote | undefined = loader.files[pathJoined];
  const file: FileLocal | FileRemote | undefined = await loader.getFile(fileRef || pathJoined);
  return await parseSfz(prefix, file?.contents);
}

function processDirective(input: string) {
  return input.match(/[^# "]+/g) || [];
}

function processHeader(input: string) {
  return input.match(/[^< >]+/g) || [];
}

function processOpcode(input: string) {
  const output: any = [];
  const labels: string[] = input.match(/\w+(?==)/g) || [];
  const values: string[] = input.split(/\w+(?==)/g) || [];
  values.forEach((val: string) => {
    if (!val.length) return;
    output.push({
      '@name': labels[output.length],
      '@value': val.trim().replace(/[='"]/g, ''),
    });
  });
  return output;
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
        const start: number = midiNameToNum(valuesRegion.lokey || valuesRegion.key);
        const end: number = midiNameToNum(valuesRegion.hikey || valuesRegion.key);
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

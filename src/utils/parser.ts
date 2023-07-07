import { AudioSfz, AudioSfzOpcode, AudioSfzOpcodeObj, AudioSfzOpcodes, AudioSfzVariables } from '../types/audio';
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
  let map: any = {};
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
      if (matches[0] === 'include') {
        const includeVal: any = await loadParseSfz(prefix, matches[1]);
        const includeHeader: string | undefined = containsHeader(includeVal);
        if (Array.isArray(includeVal)) {
          const parent: any = map[header][map[header].length - 1];
          if (!parent.opcode) parent.opcode = [];
          parent.opcode = parent.opcode.concat(includeVal);
        } else if (includeHeader) {
          if (map[includeHeader]) {
            map[includeHeader] = map[includeHeader].concat(includeVal[includeHeader]);
          } else {
            map = Object.assign(map, includeVal);
          }
        }
        if (DEBUG) console.log('include', header, matches[1], JSON.stringify(includeVal));
      } else if (matches[0] === 'define') {
        variables[matches[1]] = matches[2];
        if (DEBUG) console.log('define', matches[1], variables[matches[1]]);
      }
    } else if (char === '<') {
      const matches: string[] = processHeader(line);
      header = matches[0];
      values = {};
      if (!map[header]) map[header] = [];
      map[header].push(values);
      if (DEBUG) console.log(`<${header}>`);
    } else {
      if (line.includes('$')) line = processVariables(line, variables);
      const opcodeGroups: any = processOpcode(line);
      if (header) {
        if (!values.opcode) values.opcode = [];
        values.opcode = values.opcode.concat(opcodeGroups);
      } else {
        if (!Array.isArray(values)) values = [];
        values = values.concat(opcodeGroups);
      }
      if (DEBUG) console.log(line, opcodeGroups);
      if (DEBUG) console.log(values);
    }
    i = iEnd;
  }
  if (!header) return values;
  return map;
}

function containsHeader(data: any) {
  if (data.region) return 'region';
  if (data.group) return 'group';
  if (data.control) return 'control';
  if (data.global) return 'global';
  if (data.curve) return 'curve';
  if (data.effect) return 'effect';
  if (data.master) return 'master';
  if (data.midi) return 'midi';
  if (data.sample) return 'sample';
  return undefined;
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
  const output: AudioSfzOpcode[] = [];
  const labels: string[] = input.match(/\w+(?==)/g) || [];
  const values: string[] = input.split(/\w+(?==)/g) || [];
  values.forEach((val: string) => {
    if (!val.length) return;
    output.push({
      name: labels[output.length],
      value: val.trim().replace(/[='"]/g, ''),
    });
  });
  return output;
}

function processOpcodeObject(input: string) {
  const output: AudioSfzOpcodeObj = {};
  const labels: string[] = input.match(/\w+(?==)/g) || [];
  const values: string[] = input.split(/\w+(?==)/g) || [];
  values.forEach((val: string) => {
    if (!val.length) return;
    const opcodeName: string = labels[Object.keys(output).length];
    const opcodeValue: string = val.trim().replace(/[='"]/g, '');
    if (!isNaN(opcodeValue as any)) {
      output[opcodeName] = Number(opcodeValue);
    } else {
      output[opcodeName] = opcodeValue;
    }
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

function flattenSfzObject(sfzObject: AudioSfzOpcodes[]) {
  const keys: any = {};
  sfzObject.forEach((opcodes: AudioSfzOpcodes) => {
    const opcodeObj: any = opcodesToObject(opcodes);
    const start: number = midiNameToNum(opcodeObj.lokey || opcodeObj.key);
    const end: number = midiNameToNum(opcodeObj.hikey || opcodeObj.key);
    for (let i = start; i <= end; i++) {
      if (!keys[i]) keys[i] = [];
      keys[i].push(opcodeObj);
    }
  });
  return keys;
}

function opcodesToObject(opcodes: AudioSfzOpcodes) {
  const properties: any = {};
  opcodes.opcode.forEach((opcode: AudioSfzOpcode) => {
    if (!isNaN(opcode.value as any)) {
      properties[opcode.name] = Number(opcode.value);
    } else {
      properties[opcode.name] = opcode.value;
    }
  });
  return properties;
}

function findEnd(contents: string, startAt: number) {
  const isComment: boolean = contents.charAt(startAt) === '/' && contents.charAt(startAt + 1) === '/';
  for (let index: number = startAt; index < contents.length; index++) {
    const char: string = contents.charAt(index);
    if (isComment && char === '>') continue;
    if (endCharacters.includes(char)) return index;
    if (index > startAt + 1 && char === '/' && contents.charAt(index + 1) === '/') return index;
  }
  return contents.length;
}

function setParserLoader(fileLoader: FileLoader) {
  loader = fileLoader;
}

export {
  findEnd,
  flattenSfzObject,
  parseSfz,
  processDirective,
  processHeader,
  processOpcode,
  processOpcodeObject,
  processVariables,
  setParserLoader,
};

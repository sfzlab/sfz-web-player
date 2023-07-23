import {
  AudioOpcodes,
  AudioSfzAttribute,
  AudioSfzHeader,
  AudioSfzOpcode,
  AudioSfzOpcodeObj,
  AudioSfzVariables,
} from '../types/audio';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from './fileLoader';
import { midiNameToNum, pathJoin } from './utils';

let loader: FileLoader;

const DEBUG: boolean = false;
const skipCharacters: string[] = [' ', '\t', '\r', '\n'];
const endCharacters: string[] = ['>', '\r', '\n'];
const variables: any = {};

async function parseSfz(prefix: string, contents: string) {
  let elements: any[] = [];
  let element: any = {};
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
        let includePath: string = matches[1];
        if (includePath.includes('$')) includePath = processVariables(includePath, variables);
        const includeVal: any = await loadParseSfz(prefix, includePath);
        if (element.elements && includeVal.elements) {
          element.elements = element.elements.concat(includeVal.elements);
        } else {
          elements = elements.concat(includeVal);
        }
        if (DEBUG) console.log('include', includePath, JSON.stringify(includeVal));
      } else if (matches[0] === 'define') {
        variables[matches[1]] = matches[2];
        if (DEBUG) console.log('define', matches[1], variables[matches[1]]);
      }
    } else if (char === '<') {
      const matches: string[] = processHeader(line);
      element = {
        type: 'element',
        name: matches[0],
        elements: [],
      };
      elements.push(element);
      if (DEBUG) console.log(`<${element.name}>`);
    } else {
      if (line.includes('$')) line = processVariables(line, variables);
      if (!element.elements) {
        element.elements = [];
      }
      const attributes: AudioSfzAttribute[] = processOpcode(line);
      attributes.forEach((attribute: AudioSfzAttribute) => {
        element.elements.push({
          type: 'element',
          name: 'opcode',
          attributes: attribute,
        });
      });
      if (DEBUG) console.log(line, attributes);
    }
    i = iEnd;
  }
  if (elements.length > 0) return elements;
  return element;
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
  const output: AudioSfzAttribute[] = [];
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

function flattenSfzObject(headers: AudioSfzHeader[]) {
  const keys: any = {};
  let groupObj: AudioSfzOpcodeObj = {};
  headers.forEach((header: AudioSfzHeader) => {
    if (header.name === AudioOpcodes.group) {
      groupObj = opcodesToObject(header.elements);
    } else if (header.name === AudioOpcodes.region) {
      const regionObj: AudioSfzOpcodeObj = opcodesToObject(header.elements);
      const mergedObj: AudioSfzOpcodeObj = { ...groupObj, ...regionObj };
      const start: number = midiNameToNum(mergedObj.lokey || mergedObj.key);
      const end: number = midiNameToNum(mergedObj.hikey || mergedObj.key);
      if (start === 0 && end === 0) return;
      for (let i = start; i <= end; i++) {
        if (!keys[i]) keys[i] = [];
        keys[i].push(mergedObj);
      }
    }
  });
  return keys;
}

function opcodesToObject(opcodes: AudioSfzOpcode[]) {
  const properties: AudioSfzOpcodeObj = {};
  opcodes.forEach((opcode: AudioSfzOpcode) => {
    if (!isNaN(opcode.attributes.value as any)) {
      properties[opcode.attributes.name] = Number(opcode.attributes.value);
    } else {
      properties[opcode.attributes.name] = opcode.attributes.value;
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
  opcodesToObject,
  parseSfz,
  processDirective,
  processHeader,
  processOpcode,
  processOpcodeObject,
  processVariables,
  setParserLoader,
};

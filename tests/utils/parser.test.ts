import {
  findEnd,
  parseSfz,
  processDirective,
  processHeader,
  processOpcode,
  processOpcodeObject,
  processVariables,
  setParserLoader,
} from '../../src/utils/parser';
import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import FileLoader from '../../src/utils/fileLoader';
import { FileLocal } from '../../src/types/files';
import { get } from '../../src/utils/api';

const directory: string = 'tests/syntax/';
const sfzTests: string[] = globSync('./sfz-tests/**/*.sfz');
const prefix: string = `https://github.com/kmturley/sfz-tests/tree/feature/parsed/`;
let loader: FileLoader;

beforeAll(() => {
  loader = new FileLoader();
  setParserLoader(loader);
  loader.setRoot(directory);
});

function removeNullData(input: string) {
  if (
    input ===
    `{
      "sfz": null
    }
    `
  )
    return input;
  return input.replace(/null/g, '{}');
}

function removeAtSymbols(input: string) {
  input = input.replace(/@name/g, 'name');
  return input.replace(/@value/g, 'value');
}

test('parseSfz 01-basic.sfz', async () => {
  const filenames: string[] = ['01-basic.sfz', '01-basic.json'];
  filenames.forEach((filename: string) => {
    loader.addFileContents(directory + filename, readFileSync(directory + filename).toString());
  });
  const fileSfz: FileLocal = (await loader.getFile('01-basic.sfz')) as FileLocal;
  const fileJson: FileLocal = (await loader.getFile('01-basic.json')) as FileLocal;
  const input: any = JSON.parse(removeNullData(removeAtSymbols(fileJson.contents)));
  const output: any = { sfz: await parseSfz(directory, fileSfz.contents) };
  expect(output).toEqual(input);
});

test('parseSfz 02-include.sfz', async () => {
  const filenames: string[] = ['02-include.sfz', '02-include.json', 'modules/env.sfz', 'modules/region.sfz'];
  filenames.forEach((filename: string) => {
    loader.addFileContents(directory + filename, readFileSync(directory + filename).toString());
  });
  const fileSfz: FileLocal = (await loader.getFile('02-include.sfz')) as FileLocal;
  const fileJson: FileLocal = (await loader.getFile('02-include.json')) as FileLocal;
  const input: any = JSON.parse(removeNullData(removeAtSymbols(fileJson.contents)));
  const output: any = { sfz: await parseSfz(directory, fileSfz.contents) };
  expect(output).toEqual(input);
});

// Test complex hand-coded instrument
test('parseSfz 01-green_keyswitch.sfz', async () => {
  const path: string = 'https://raw.githubusercontent.com/kmturley/karoryfer.black-and-green-guitars/main/Programs/';
  const fileSfz: string = await get(`${path}01-green_keyswitch.sfz`);
  const fileJson: string = await get(`${path}01-green_keyswitch.json`);
  const input: any = JSON.parse(removeNullData(removeAtSymbols(fileJson)));
  const output: any = { sfz: await parseSfz(path, fileSfz) };

  // For debugging json outputs
  // const property: string = 'region';
  // writeFileSync('input.json', JSON.stringify(input.sfz[property], null, 2));
  // writeFileSync('output.json', JSON.stringify(output.sfz[property], null, 2));

  expect(output.sfz.control).toEqual(input.sfz.control);
  expect(output.sfz.global).toEqual(input.sfz.global);
  expect(output.sfz.master).toEqual(input.sfz.master);
  expect(output.sfz.region).toEqual(input.sfz.region);
  expect(output.sfz.group).toEqual(input.sfz.group);
  expect(output.sfz.curve).toEqual(input.sfz.curve);
});

// Test entire sfz test suite
test.each(sfzTests)('parseSfz %p', async (sfzFile: string) => {
  const source: string = readFileSync(sfzFile).toString();
  const text: string = readFileSync(sfzFile.replace('.sfz', '.json')).toString();
  const result: string = JSON.parse(removeNullData(removeAtSymbols(text)));
  expect({ sfz: await parseSfz(prefix, source) }).toEqual(result);
});

test('processDirective', () => {
  expect(processDirective('#include "green/stac_tp.sfz"')).toEqual(['include', 'green/stac_tp.sfz']);
  expect(processDirective('#define $KICKKEY 36')).toEqual(['define', '$KICKKEY', '36']);
});

test('processHeader', () => {
  expect(processHeader('<region')).toEqual(['region']);
  expect(processHeader('< region')).toEqual(['region']);
  expect(processHeader('<region>')).toEqual(['region']);
  expect(processHeader('<region >')).toEqual(['region']);
  expect(processHeader('region>')).toEqual(['region']);
});

test('processOpcode', () => {
  expect(processOpcode('seq_position=3')).toEqual([{ name: 'seq_position', value: '3' }]);
  expect(processOpcode('seq_position=3 pitch_keycenter=50')).toEqual([
    { name: 'seq_position', value: '3' },
    { name: 'pitch_keycenter', value: '50' },
  ]);
  expect(processOpcode('region_label=01 sample=harmLA0.$EXT')).toEqual([
    { name: 'region_label', value: '01' },
    { name: 'sample', value: 'harmLA0.$EXT' },
  ]);
  expect(processOpcode('label_cc27="Release vol"')).toEqual([{ name: 'label_cc27', value: 'Release vol' }]);
  expect(processOpcode('label_cc27=Release vol')).toEqual([{ name: 'label_cc27', value: 'Release vol' }]);
  expect(processOpcode('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual([
    { name: 'apple', value: 'An Apple' },
    { name: 'banana', value: 'A Banana' },
    { name: 'carrot', value: 'A Carrot' },
  ]);
  expect(processOpcode('lokey=c5  hikey=c#5')).toEqual([
    { name: 'lokey', value: 'c5' },
    { name: 'hikey', value: 'c#5' },
  ]);
  expect(processOpcode('ampeg_hold=0.3')).toEqual([{ name: 'ampeg_hold', value: '0.3' }]);
  expect(processOpcode('ampeg_decay_oncc70=-1.2')).toEqual([{ name: 'ampeg_decay_oncc70', value: '-1.2' }]);
});

test('processOpcodeObject', () => {
  expect(processOpcodeObject('seq_position=3')).toEqual({ seq_position: 3 });
  expect(processOpcodeObject('seq_position=3 pitch_keycenter=50')).toEqual({ seq_position: 3, pitch_keycenter: 50 });
  expect(processOpcodeObject('region_label=01 sample=harmLA0.$EXT')).toEqual({
    region_label: 1,
    sample: 'harmLA0.$EXT',
  });
  expect(processOpcodeObject('label_cc27="Release vol"')).toEqual({ label_cc27: 'Release vol' });
  expect(processOpcodeObject('label_cc27=Release vol')).toEqual({ label_cc27: 'Release vol' });
  expect(processOpcodeObject('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual({
    apple: 'An Apple',
    banana: 'A Banana',
    carrot: 'A Carrot',
  });
  expect(processOpcodeObject('lokey=c5  hikey=c#5')).toEqual({ lokey: 'c5', hikey: 'c#5' });
});

test('processVariables', () => {
  expect(processVariables('sample=harmLA0.$EXT', { $EXT: 'flac' })).toEqual('sample=harmLA0.flac');
});

test('findEnd', () => {
  const sfzHeader: string = `//----
  //
  // The <group> header
  //`;
  expect(findEnd(sfzHeader, 0)).toEqual(6);
  expect(findEnd(sfzHeader, 9)).toEqual(11);
  expect(findEnd(sfzHeader, 14)).toEqual(35);
  expect(findEnd('sample=example.wav key=c4 // will play', 0)).toEqual(26);
  expect(findEnd('/// long release group, cc1 < 64', 0)).toEqual(32);
});

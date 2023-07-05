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
import { readFileSync } from 'fs';
import 'whatwg-fetch';
import FileLoader from '../../src/utils/fileLoader';
import { FileLocal } from '../../src/types/files';

const sfzTests: string[] = globSync('./sfz-tests/**/*.sfz');
const prefix: string = `https://github.com/kmturley/sfz-tests/tree/feature/parsed/`;
let loader: FileLoader;

beforeAll(() => {
  loader = new FileLoader();
  setParserLoader(loader);
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

// Test individual file with includes
test('parseSfz root_local.sfz', async () => {
  const directory: string = 'tests/other/';
  loader.setRoot(directory);
  const filenames: string[] = ['root_local.sfz', 'root_local.json', 'included.sfz'];
  filenames.forEach((filename: string) => {
    loader.addFileContents(directory + filename, readFileSync(directory + filename).toString());
  });
  const fileSfz: FileLocal = (await loader.getFile('root_local.sfz')) as FileLocal;
  const fileJson: FileLocal = (await loader.getFile('root_local.json')) as FileLocal;
  const result: string = JSON.parse(removeNullData(removeAtSymbols(fileJson.contents)));
  expect({ sfz: await parseSfz(directory, fileSfz.contents) }).toEqual(result);
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

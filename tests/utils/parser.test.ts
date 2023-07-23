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
import FileLoader from '../../src/utils/fileLoader';
import { FileLocal } from '../../src/types/files';
import { get } from '../../src/utils/api';
import { js2xml } from 'xml-js';

const directory: string = 'tests/syntax/';
const sfzTests: string[] = globSync('./sfz-tests/**/*.sfz');
const prefix: string = `https://github.com/kmturley/sfz-tests/tree/feature/parsed-xml/`;
let loader: FileLoader;

beforeAll(() => {
  loader = new FileLoader();
  setParserLoader(loader);
  loader.setRoot(directory);
});

function convertToXml(elements: any) {
  const xml: string = js2xml(
    {
      declaration: {
        attributes: {
          version: '1.0',
        },
      },
      elements,
    },
    { spaces: '\t' }
  );
  // TODO do better
  return xml.replace(/\/>/g, ' />') + '\n';
}

test('parseSfz basic.sfz', async () => {
  loader.addFilesContents(directory, ['basic.sfz', 'basic.xml']);
  const fileSfz: FileLocal = (await loader.getFile('basic.sfz')) as FileLocal;
  const fileXml: FileLocal = (await loader.getFile('basic.xml')) as FileLocal;
  const output: any = convertToXml(await parseSfz(directory, fileSfz.contents));
  expect(output).toEqual(fileXml.contents);
});

test('parseSfz defines.sfz', async () => {
  loader.addFilesContents(directory, ['defines.sfz', 'defines.xml']);
  const fileSfz: FileLocal = (await loader.getFile('defines.sfz')) as FileLocal;
  const fileXml: FileLocal = (await loader.getFile('defines.xml')) as FileLocal;
  const output: any = convertToXml(await parseSfz(directory, fileSfz.contents));
  expect(output).toEqual(fileXml.contents);
});

test('parseSfz groups.sfz', async () => {
  loader.addFilesContents(directory, ['groups.sfz', 'groups.xml']);
  const fileSfz: FileLocal = (await loader.getFile('groups.sfz')) as FileLocal;
  const fileXml: FileLocal = (await loader.getFile('groups.xml')) as FileLocal;
  const output: any = convertToXml(await parseSfz(directory, fileSfz.contents));
  expect(output).toEqual(fileXml.contents);
});

test('parseSfz include-defines.sfz', async () => {
  loader.addFilesContents(directory, [
    'include-defines.sfz',
    'include-defines.xml',
    'modules/env.sfz',
    'modules/region.sfz',
  ]);
  const fileSfz: FileLocal = (await loader.getFile('include-defines.sfz')) as FileLocal;
  const fileXml: FileLocal = (await loader.getFile('include-defines.xml')) as FileLocal;
  const output: any = convertToXml(await parseSfz(directory, fileSfz.contents));
  expect(output).toEqual(fileXml.contents);
});

test('parseSfz include.sfz', async () => {
  loader.addFilesContents(directory, ['include.sfz', 'include.xml', 'modules/env.sfz', 'modules/region.sfz']);
  const fileSfz: FileLocal = (await loader.getFile('include.sfz')) as FileLocal;
  const fileXml: FileLocal = (await loader.getFile('include.xml')) as FileLocal;
  const output: any = convertToXml(await parseSfz(directory, fileSfz.contents));
  expect(output).toEqual(fileXml.contents);
});

// Test complex hand-coded instrument
test('parseSfz 01-green_keyswitch.sfz', async () => {
  const path: string = 'https://raw.githubusercontent.com/kmturley/karoryfer.black-and-green-guitars/main/Programs/';
  const fileSfz: string = await get(`${path}01-green_keyswitch.sfz`);
  const fileXml: string = await get(`${path}01-green_keyswitch.xml`);
  const output: any = convertToXml(await parseSfz(path, fileSfz));
  expect(output).toEqual(fileXml);
});

// Test entire sfz test suite
test.each(sfzTests)('parseSfz %p', async (sfzFile: string) => {
  const fileSfz: string = readFileSync(sfzFile).toString();
  const fileXml: string = readFileSync(sfzFile.replace('.sfz', '.xml')).toString();
  const output: any = convertToXml(await parseSfz(prefix, fileSfz));
  expect(output).toEqual(fileXml);
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

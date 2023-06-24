import {
  findEnd,
  parseSfz,
  processDirective,
  processHeader,
  processOpcode,
  processVariables,
} from '../../src/utils/parser';
import { globSync } from 'glob';
import { readFileSync } from 'fs';
import 'whatwg-fetch';

const sfzTests: string[] = globSync('./sfz-tests/**/*.sfz');
const prefix: string = `https://github.com/kmturley/sfz-tests/tree/feature/parsed/`;

function removeNullData(input: string) {
  if (
    input ===
    `{
  "sfz": null
}
`
  )
    return input;
  return input.replace('null', '{ "opcode": [] }');
}

// // Test entire sfz test suite
test.each(sfzTests)('parseSfz %p', async (sfzFile: string) => {
  const source: string = readFileSync(sfzFile).toString();
  const text: string = readFileSync(sfzFile.replace('.sfz', '.json')).toString();
  const result: string = JSON.parse(removeNullData(text));
  expect({ sfz: await parseSfz(prefix, source) }).toEqual(result);
});

// Test individual file
test('parseSfz', async () => {
  const sfzFile: string = 'sfz-tests/sfz2 basic tests/00 - syntax/04 - syntax group.sfz';
  const source: string = readFileSync(sfzFile).toString();
  const text: string = readFileSync(sfzFile.replace('.sfz', '.json')).toString();
  const result: string = JSON.parse(removeNullData(text));
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
  expect(processOpcode('seq_position=3')).toEqual([{ '@name': 'seq_position', '@value': '3' }]);
  expect(processOpcode('seq_position=3 pitch_keycenter=50')).toEqual([
    { '@name': 'seq_position', '@value': '3' },
    { '@name': 'pitch_keycenter', '@value': '50' },
  ]);
  expect(processOpcode('region_label=01 sample=harmLA0.$EXT')).toEqual([
    { '@name': 'region_label', '@value': '01' },
    { '@name': 'sample', '@value': 'harmLA0.$EXT' },
  ]);
  expect(processOpcode('label_cc27="Release vol"')).toEqual([{ '@name': 'label_cc27', '@value': 'Release vol' }]);
  expect(processOpcode('label_cc27=Release vol')).toEqual([{ '@name': 'label_cc27', '@value': 'Release vol' }]);
  expect(processOpcode('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual([
    { '@name': 'apple', '@value': 'An Apple' },
    { '@name': 'banana', '@value': 'A Banana' },
    { '@name': 'carrot', '@value': 'A Carrot' },
  ]);
  expect(processOpcode('lokey=c5  hikey=c#5')).toEqual([
    { '@name': 'lokey', '@value': 'c5' },
    { '@name': 'hikey', '@value': 'c#5' },
  ]);
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

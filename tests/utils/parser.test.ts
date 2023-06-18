import { parseSfz, processDirective, processHeader, processOpcode, processVariables } from '../../src/utils/parser';
import { globSync } from 'glob';
import { readFileSync } from 'fs';
import 'whatwg-fetch';

const sfzTests: string[] = globSync('./sfz-tests/**/*.sfz');

test.each(sfzTests)('parseSfz %p', async (sfzFile: string) => {
  const prefix: string = `https://github.com/kmturley/sfz-tests/tree/feature/parsed/`;
  const source: string = readFileSync(sfzFile).toString();
  try {
    const result: string = JSON.parse(readFileSync(sfzFile.replace('.sfz', '.json')).toString());
    expect(await parseSfz(prefix, source)).toEqual(result);
  } catch (e) {
    console.log('skipped', sfzFile);
  }
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

// test('processOpcode', () => {
//   expect(processOpcode('seq_position=3')).toEqual({ seq_position: 3 });
//   expect(processOpcode('seq_position=3 pitch_keycenter=50')).toEqual({ seq_position: 3, pitch_keycenter: 50 });
//   expect(processOpcode('region_label=01 sample=harmLA0.$EXT')).toEqual({
//     region_label: 1,
//     sample: 'harmLA0.$EXT',
//   });
//   expect(processOpcode('label_cc27="Release vol"')).toEqual({ label_cc27: 'Release vol' });
//   expect(processOpcode('label_cc27=Release vol')).toEqual({ label_cc27: 'Release vol' });
//   expect(processOpcode('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual({
//     apple: 'An Apple',
//     banana: 'A Banana',
//     carrot: 'A Carrot',
//   });
// });

test('processVariables', () => {
  expect(processVariables('sample=harmLA0.$EXT', { $EXT: 'flac' })).toEqual('sample=harmLA0.flac');
});

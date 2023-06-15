import { get } from '../../src/utils/api';
import { parseSfz, processDirective, processHeader, processOpcode, processVariables } from '../../src/utils/parser';
import { encodeHashes, pathDir } from '../../src/utils/utils';
import 'whatwg-fetch';

const sfzFiles: string[] = [
  'https://raw.githubusercontent.com/sfz/tests/master/sfz1%20basic%20tests/01%20-%20Amp%20LFO/01%20-%20amp%20lfo%20freq.sfz',
  'https://raw.githubusercontent.com/sfz/tests/master/sfz1%20basic%20tests/01%20-%20Amp%20LFO/02%20-%20amp%20lfo%20freq%20cc1%20and%20after.sfz',
  'https://raw.githubusercontent.com/sfz/tests/master/sfz1%20basic%20tests/01%20-%20Amp%20LFO/03%20-%20amp%20lfo%20depth.sfz',
  'https://raw.githubusercontent.com/sfz/tests/master/sfz1%20basic%20tests/01%20-%20Amp%20LFO/04%20-%20amp%20lfo%20depth%20on%20cc.sfz',
  'https://raw.githubusercontent.com/sfz/tests/master/sfz1%20basic%20tests/01%20-%20Amp%20LFO/05%20-%20amp%20lfo%20depth%20on%20channel%20aftertouch.sfz',
  'https://raw.githubusercontent.com/sfz/tests/master/sfz1%20basic%20tests/01%20-%20Amp%20LFO/06%20-%20amp%20lfo%20delay.sfz',
  'https://raw.githubusercontent.com/sfz/tests/master/sfz1%20basic%20tests/01%20-%20Amp%20LFO/07%20-%20amp%20lfo%20fade.sfz',
];

test.each(sfzFiles)('parseSfz %p', async (sfzFile: string) => {
  const prefix: string = pathDir(sfzFile);
  const contents: string = await get(encodeHashes(sfzFile));
  expect(await parseSfz(prefix, contents, true)).toMatchSnapshot();
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
  expect(processOpcode('seq_position=3')).toEqual({ seq_position: 3 });
  expect(processOpcode('seq_position=3 pitch_keycenter=50')).toEqual({ seq_position: 3, pitch_keycenter: 50 });
  expect(processOpcode('region_label=01 sample=harmLA0.$EXT')).toEqual({
    region_label: 1,
    sample: 'harmLA0.$EXT',
  });
  expect(processOpcode('label_cc27="Release vol"')).toEqual({ label_cc27: 'Release vol' });
  expect(processOpcode('label_cc27=Release vol')).toEqual({ label_cc27: 'Release vol' });
  expect(processOpcode('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual({
    apple: 'An Apple',
    banana: 'A Banana',
    carrot: 'A Carrot',
  });
});

test('processVariables', () => {
  expect(processVariables('sample=harmLA0.$EXT', { $EXT: 'flac' })).toEqual('sample=harmLA0.flac');
});

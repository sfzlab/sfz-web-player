import { processDirective, processHeader, processOpcode, processVariables } from '../../src/utils/parser';

test('processDirective', async () => {
  expect(processDirective('#include "green/stac_tp.sfz"')).toEqual(['include', 'green/stac_tp.sfz']);
  expect(processDirective('#define $KICKKEY 36')).toEqual(['define', '$KICKKEY', '36']);
});

test('processHeader', async () => {
  expect(processHeader('<region')).toEqual(['region']);
  expect(processHeader('< region')).toEqual(['region']);
  expect(processHeader('<region>')).toEqual(['region']);
  expect(processHeader('<region >')).toEqual(['region']);
  expect(processHeader('region>')).toEqual(['region']);
});

test('processOpcode', async () => {
  expect(processOpcode('seq_position=3')).toEqual(['seq_position', '3']);
  expect(processOpcode('seq_position=3 pitch_keycenter=50')).toEqual(['seq_position', '3', 'pitch_keycenter', '50']);
  expect(processOpcode('region_label=01 sample=harmLA0.$EXT')).toEqual([
    'region_label',
    '01',
    'sample',
    'harmLA0.$EXT',
  ]);
  expect(processOpcode('label_cc27="Release vol"')).toEqual(['label_cc27', 'Release vol']);
  expect(processOpcode('label_cc27=Release vol')).toEqual(['label_cc27', 'Release vol']);
  expect(processOpcode('apple=An Apple banana=\'A Banana\' carrot="A Carrot"')).toEqual(['apple', 'An Apple', 'banana', 'A Banana', 'carrot', 'A Carrot']);
});

test('processVariables', async () => {
  expect(processVariables('sample=harmLA0.$EXT', { $EXT: 'flac' })).toEqual('sample=harmLA0.flac');
});

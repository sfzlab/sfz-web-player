import { processDirective, processHeader, processOpcode } from '../../src/utils/parser';

test('processDirective', async () => {
  expect(processDirective('#include "green/stac_tp.sfz"')).toEqual(['include', 'green/stac_tp.sfz']);
  expect(processDirective('#define $KICKKEY 36')).toEqual(['define', 'KICKKEY', '36']);
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
});

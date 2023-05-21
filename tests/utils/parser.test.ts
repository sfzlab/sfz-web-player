import { processDirective, processHeader, processOpcode } from '../../src/utils/parser';

test('processDirective', async () => {
  const input: string = '#include "modules/maps_green/stac_tp.sfz"';
  expect(processDirective(input)).toEqual(['include', 'modules/maps_green/stac_tp.sfz']);
});

test('processHeader', async () => {
  expect(processHeader('<region')).toBeUndefined();
  expect(processHeader('<region>')).toEqual('region');
  expect(processHeader('region>')).toBeUndefined();
});

test('processOpcode', async () => {
  expect(processOpcode('seq_position=3')).toEqual(['seq_position', '3']);
  expect(processOpcode('seq_position=3 pitch_keycenter=50')).toEqual(['seq_position', '3', 'pitch_keycenter', '50']);
  expect(processOpcode('seq_position=3 pitch_keycenter=50 bend_up=163')).toEqual([
    'seq_position',
    '3',
    'pitch_keycenter',
    '50',
    'bend_up',
    '163',
  ]);
});

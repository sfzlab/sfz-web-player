import { midiNameToNum, pathJoin } from '../../src/utils/utils';

test('midiNameToNum', async () => {
  expect(midiNameToNum('c1')).toEqual(24);
  expect(midiNameToNum('C#1')).toEqual(25);
  expect(midiNameToNum('Db1')).toEqual(25);
  expect(midiNameToNum('c4')).toEqual(60);
  expect(midiNameToNum('C#5')).toEqual(73);
  expect(midiNameToNum('Db5')).toEqual(73);
});

test('pathJoin', async () => {
  expect(pathJoin('https://domain.com/apple', 'banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', 'banana')).toEqual('https://domain.com/apple/banana');

  expect(pathJoin('https://domain.com/apple', '/banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', '/banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', '', 'banana')).toEqual('https://domain.com/apple/banana');

  expect(pathJoin('https://domain.com/apple', '../banana')).toEqual('https://domain.com/banana');
  expect(pathJoin('https://domain.com/apple/', '../banana')).toEqual('https://domain.com/banana');

  expect(pathJoin('Programs/', '', '..\\Samples\\Noise\\Slide_Noise\\Slide_Noise1.flac')).toEqual(
    'Samples/Noise/Slide_Noise/Slide_Noise1.flac'
  );
  expect(pathJoin('Programs/', '', '../Samples/Release4/e6_Rel4_4.flac')).toEqual('Samples/Release4/e6_Rel4_4.flac');
});

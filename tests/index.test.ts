import { Editor, Interface, Player } from '../src/index';

test('Import Editor', async () => {
  const sfzEditor = new Editor({});
  expect(sfzEditor.loader).toBeDefined();
});

test('Import Interface', async () => {
  const sfzInterface = new Interface({});
  expect(sfzInterface.loader).toBeDefined();
});

test('Import Player', async () => {
  const sfzPlayer = new Player('test', {});
  expect(sfzPlayer.loader).toBeDefined();
});

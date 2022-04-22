import minSize from '@src/utils/resize';

test('Resize 1', () => {
  expect(minSize(1000, 100, 100)).toBe(`900rem`);
});

test('Resize 2', () => {
  expect(minSize(1000, 1000, 100)).toBe(`100rem`);
});

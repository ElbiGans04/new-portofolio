import randomNumber from '@src/utils/randomNumber';

test('Random Number', () => {
  expect(randomNumber(1)).toMatch(/^\d+$/);
});

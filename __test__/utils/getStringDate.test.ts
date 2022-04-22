import parseDate from '@src/utils/getStringDate';
test('Parse Date', () => {
  expect(parseDate('Tue Apr 12 2022 20:10:21 GMT+0700')).toMatch(
    /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
  );
});

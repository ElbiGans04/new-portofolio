import { fetcherGeneric } from '@src/utils/fetcher';

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn(() => Promise.resolve({ name: 'abc' })),
});

const fetchGen = fetcherGeneric<{ name: string }>('/abc');
const fetchMock = fetch as any as jest.Mock;

test('FetchGeneric mengembalikan nilai berupa object', () => {
  return fetchGen.then((res) => {
    expect(res).toEqual({ name: 'abc' });
  });
});

test('FetchGeneric memanggil fetch sebanyak 1 kali', () => {
  return fetchGen.then((res) => {
    expect(fetchMock.mock.calls.length).toBe(1);
  });
});

test('FetchGeneric memanggil fetch sebanyak 1 kali dengan 2 argument', () => {
  return fetchGen.then((res) => {
    expect(fetchMock.mock.calls[0].length).toBe(2);
  });
});

test('FetchGeneric memanggil fetch sebanyak 1 kali dengan 2 argument. Argument 1 adalah string', () => {
  return fetchGen.then((res) => {
    expect(fetchMock.mock.calls[0][0]).toBe('/abc');
  });
});

test('FetchGeneric memanggil fetch sebanyak 1 kali dengan 2 argument. Argument 2 adalah object', () => {
  return fetchGen.then((res) => {
    expect(fetchMock.mock.calls[0][1]).toBeInstanceOf(Object);
  });
});

test('FetchGeneric memanggil method json sebanyak 1 kali', () => {
  return fetchGen.then(async (res) => {
    const fetchMock2 = (await fetchMock()) as { json: jest.Mock };
    expect(fetchMock2.json.mock.calls.length).toBe(1);
  });
});

test('FetchGeneric memanggil method json sebanyak 1 kali dan tanpa argument', () => {
  return fetchGen.then(async (res) => {
    const fetchMock2 = (await fetchMock()) as { json: jest.Mock };
    expect(fetchMock2.json.mock.calls[0].length).toBe(0);
  });
});

import upperFirstWord from '@src/utils/upperFirstWord';
import minSize from '@src/utils/resize';
import randomNumber from '@src/utils/randomNumber';
import parseDate from '@src/utils/getStringDate';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import { NextApiResponse } from 'next';
import { verifyJwt, signJwt } from '@src/utils/jwt';
import { fetcherGeneric } from '@src/utils/fetcher';
import {
  clientHandlerError,
  clientHandlerSuccess,
} from '@src/utils/clientHandler';
import * as jose from 'jose';

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn(() => Promise.resolve({ name: 'abc' })),
});

// Mock
jest.mock('jose', () => {
  const originalModule = jest.requireActual('jose');
  return {
    __esModule: true,
    ...originalModule,
    importSPKI: jest.fn().mockResolvedValue('KUNCI'),
    jwtVerify: jest.fn().mockResolvedValue({
      iat: 12345678,
    }),
    importPKCS8: jest.fn().mockResolvedValue('KEY'),
    SignJWT: jest.fn().mockReturnValue({
      setIssuedAt: jest.fn().mockReturnThis(),
      setProtectedHeader: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue('abc'),
    }),
  };
});

test('upperFirstWord', () => {
  expect(upperFirstWord('hello')).toBe('Hello');
});

describe('Resize', () => {
  test('Resize 1', () => {
    expect(minSize(1000, 100, 100)).toBe(`900rem`);
  });

  test('Resize 2', () => {
    expect(minSize(1000, 1000, 100)).toBe(`100rem`);
  });
});

test('Random Number', () => {
  expect(randomNumber(1)).toMatch(/^\d+$/);
});

test('Parse Date', () => {
  expect(parseDate('Tue Apr 12 2022 20:10:21 GMT+0700')).toMatch(
    /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
  );
});

describe('routerErrorHandling', () => {
  type Obj = {
    status: jest.Mock;
    json: jest.Mock;
  };
  const obj = {
    status: jest.fn(function (this: Obj, code: number) {
      return this;
    }),
    json: jest.fn(),
  };

  routerErrorHandling(obj as any as NextApiResponse, new Error('not found'));
  test('Panggil method status 1x saja', () => {
    expect(obj.status.mock.calls.length).toBe(1);
  });

  test('Panggil method status hanya dengan 1 argument', () => {
    expect(obj.status.mock.calls[0].length).toBe(1);
  });

  test('argument method status adalah 500', () => {
    expect(obj.status.mock.calls[0][0]).toBe(500);
  });

  test('Panggil method json 1x saja', () => {
    expect(obj.json.mock.calls.length).toBe(1);
  });

  test('Panggil method json hanya dengan 1 argument', () => {
    expect(obj.json.mock.calls[0].length).toBe(1);
  });

  test('argument method json adalah object', () => {
    expect(obj.json.mock.calls[0][0]).toEqual({
      errors: [
        {
          title: `Error happend when request`,
          detail: `Error happend when request`,
          status: `500`,
        },
      ],
    });
  });
});

describe('JWT', () => {
  describe('Verify', () => {
    const verify = verifyJwt('AS');
    const joseImport = jose.importSPKI as any as jest.Mock;
    const joseVerif = jose.jwtVerify as any as jest.Mock;

    test('Nilai yang dikembalikan Verify berupa object', async () => {
      expect(verify).resolves.toEqual({
        iat: 12345678,
      });
    });

    test('fungsi verify Memanggil importSpki 1 kali', async () => {
      await verify;
      expect(joseImport.mock.calls.length).toBe(1);
    });

    test('fungsi verify Memanggil importSpki dengan 2 argument', async () => {
      await verify;
      expect(joseImport.mock.calls[0].length).toBe(2);
    });

    test('fungsi verify Memanggil importSpki dengan argument pertama berupa Pub Key', async () => {
      await verify;
      expect(joseImport.mock.calls[0][0]).toBe(process.env.PUBLIC_KEY);
    });

    test('fungsi verify Memanggil importSpki dengan argument kedua berupa RS256', async () => {
      await verify;
      expect(joseImport.mock.calls[0][1]).toBe('RS256');
    });

    test('fungsi verify Memanggil jwtVerify 1 kali', async () => {
      await verify;
      expect(joseVerif.mock.calls.length).toBe(1);
    });

    test('fungsi verify Memanggil jwtVerify dengan 2 argument', async () => {
      await verify;
      expect(joseVerif.mock.calls[0].length).toBe(2);
    });

    test("fungsi verify Memanggil jwtVerify dengan argument pertama berupa 'as'", async () => {
      await verify;
      expect(joseVerif.mock.calls[0][0]).toBe('AS');
    });

    test("fungsi verify Memanggil jwtVerify dengan argument pertama berupa 'KUNCI'", async () => {
      await verify;
      expect(joseVerif.mock.calls[0][1]).toBe('KUNCI');
    });
  });

  describe('Sign', () => {
    const sign = signJwt();
    const joseImport = jose.importPKCS8 as any as jest.Mock;
    const joseSign = jose.SignJWT as any as jest.Mock;

    type ReturnedObject = {
      setIssuedAt: jest.Mock;
      setProtectedHeader: jest.Mock;
      sign: jest.Mock;
    };

    test('Nilai yang dikembalikan berupa string', () => {
      return expect(sign).resolves.toBe('abc');
    });

    test('fungsi signJwt Memanggil importSpki 1 kali', async () => {
      await sign;
      expect(joseImport.mock.calls.length).toBe(1);
    });

    test('fungsi signJwt Memanggil importSpki dengan 2 argument', async () => {
      await sign;
      expect(joseImport.mock.calls[0].length).toBe(2);
    });

    test('fungsi signJwt Memanggil importSpki dengan argument pertama berupa Pub Key', async () => {
      await sign;
      expect(joseImport.mock.calls[0][0]).toBe(process.env.PRIVATE_KEY);
    });

    test('fungsi signJwt Memanggil importSpki dengan argument kedua berupa RS256', async () => {
      await sign;
      expect(joseImport.mock.calls[0][1]).toBe('RS256');
    });

    test('fungsi signJwt Memanggil signJwt 1x', async () => {
      await sign;
      expect(joseSign.mock.calls.length).toBe(1);
    });

    test('fungsi signJwt Memanggil signJwt dengan 1 argument', async () => {
      await sign;
      expect(joseSign.mock.calls[0].length).toBe(1);
    });

    test('fungsi signJwt Memanggil signJwt dengan argument pertama adalah object', async () => {
      await sign;
      expect(joseSign.mock.calls[0][0]).toEqual({ isLoggedIn: true });
    });

    test('fungsi signJwt Memanggil setIssuedAt 1x', async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.setIssuedAt.mock.calls.length).toBe(1);
    });

    test('fungsi signJwt Memanggil setIssuedAt 1x tanpa argument', async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.setIssuedAt.mock.calls[0].length).toBe(0);
    });

    test('fungsi signJwt Memanggil setProtectedHeader 1x', async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.setProtectedHeader.mock.calls.length).toBe(1);
    });

    test('fungsi signJwt Memanggil setProtectedHeader 1x dengan 1 argument', async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.setProtectedHeader.mock.calls[0].length).toBe(1);
    });

    test('fungsi signJwt Memanggil setProtectedHeader 1x dengan argument pertama berupa object', async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.setProtectedHeader.mock.calls[0][0]).toEqual({
        alg: 'RS256',
      });
    });

    test('fungsi signJwt Memanggil sign 1x', async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.sign.mock.calls.length).toBe(1);
    });

    test('fungsi signJwt Memanggil sign dengan 1 argument', async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.sign.mock.calls[0].length).toBe(1);
    });

    test("fungsi signJwt Memanggil sign dengan argument pertama berupa ' KEY '", async () => {
      await sign;
      const returnedObject = joseSign.mock.results[0].value as ReturnedObject;
      expect(returnedObject.sign.mock.calls[0][0]).toBe('KEY');
    });
  });
});

describe('fetchGeneric', () => {
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
});

describe('ClientHandler', () => {
  describe('ClientHandlerError', () => {
    const jDispatch = jest.fn();
    const jMutate = jest.fn();
    const clientHandler = clientHandlerError(
      'Hello World',
      jDispatch,
      jMutate,
      '/a',
    );

    test('Dispatch Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls.length).toBe(1);
    });

    test('Argument dispatch hanya 1 buah', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0].length).toBe(1);
    });

    test('Argument dispatch adalah object', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0][0]).toEqual({
        type: 'modal/request/finish',
        payload: {
          message: `Errors: Error when try request`,
        },
      });
    });

    test('Mutate Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jMutate.mock.calls.length).toBe(1);
    });

    test('Argument mutate hanya 1 buah', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0].length).toBe(1);
    });

    test('Argument mutate adalah /a', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0][0]).toBe('/a');
    });
  });

  describe('ClientHandlerSuccess', () => {
    const jDispatch = jest.fn();
    const jMutate = jest.fn();
    const clientHandler = clientHandlerSuccess(
      'Hello World',
      jDispatch,
      jMutate,
      '/a',
    );

    test('Dispatch Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls.length).toBe(1);
    });

    test('Argument dispatch hanya 1 buah', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0].length).toBe(1);
    });

    test('Argument dispatch adalah object', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0][0]).toEqual({
        type: 'modal/request/finish',
        payload: { message: 'Hello World' },
      });
    });

    test('Mutate Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jMutate.mock.calls.length).toBe(1);
    });

    test('Argument mutate hanya 1 buah', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0].length).toBe(1);
    });

    test('Argument mutate adalah /a', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0][0]).toBe('/a');
    });
  });
});

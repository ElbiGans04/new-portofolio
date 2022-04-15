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
import HttpError from '@src/utils/httpError';

global.fetch = jest.fn().mockResolvedValue(
  Promise.resolve({
    ok: true,
    json: jest.fn(() => Promise.resolve({ name: 'abc' })),
  }),
);

type sign = {
  setIssuedAt: () => sign;
  setProtectedHeader: () => sign;
  sign: () => string;
};
// Mock
jest.mock('jose', () => {
  const originalModule = jest.requireActual('jose');
  function SignJWT(this: sign) {
    this.setIssuedAt = () => {
      return this;
    };
    this.setProtectedHeader = () => {
      return this;
    };
    this.sign = () => {
      return 'abc';
    };
  }
  return {
    __esModule: true,
    ...originalModule,
    importSPKI: jest.fn().mockReturnValue('KUNCI'),
    jwtVerify: jest.fn(() => {
      return {
        iat: 12345678,
      };
    }),
    importPKCS8: jest.fn().mockReturnValue('KEY'),
    SignJWT,
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
  test('Verify', () => {
    return expect(verifyJwt('AS')).resolves.toEqual({
      iat: 12345678,
    });
  });

  test('Sign', () => {
    return expect(signJwt()).resolves.toBe('abc');
  });
});

test('FetchGeneric', () => {
  return fetcherGeneric<{ name: string }>('/abc').then((res) => {
    expect(res).toEqual({ name: 'abc' });
  });
});

describe('ClientHandler', () => {
  describe('ClientHandlerError', () => {
    test('Dispatch Hanya dipanggil satu kali', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerError('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jDispatch.mock.calls.length).toBe(1);
        },
      );
    });

    test('Argument dispatch hanya 1 buah', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerError('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jDispatch.mock.calls[0].length).toBe(1);
        },
      );
    });

    test('Argument dispatch adalah object', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerError('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jDispatch.mock.calls[0][0]).toEqual({
            type: 'modal/request/finish',
            payload: {
              message: `Errors: Error when try request`,
            },
          });
        },
      );
    });

    test('Argument dispatch adalah object yang bedasarkan error object', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerError(
        new HttpError('Hello World', 123, 'Hello World'),
        jDispatch,
        jMutate,
        '/a',
      ).then(() => {
        expect(jDispatch.mock.calls[0][0]).toEqual({
          type: 'modal/request/finish',
          payload: {
            message: `Errors: Hello World`,
          },
        });
      });
    });

    test('Mutate Hanya dipanggil satu kali', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerError('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jMutate.mock.calls.length).toBe(1);
        },
      );
    });

    test('Argument mutate hanya 1 buah', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerError('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jMutate.mock.calls[0].length).toBe(1);
        },
      );
    });

    test('Argument mutate adalah /a', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerError('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jMutate.mock.calls[0][0]).toBe('/a');
        },
      );
    });

  });
  describe('ClientHandlerSuccess', () => {
    test('Dispatch Hanya dipanggil satu kali', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerSuccess('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jDispatch.mock.calls.length).toBe(1);
        },
      );
    });

    test('Argument dispatch hanya 1 buah', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerSuccess('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jDispatch.mock.calls[0].length).toBe(1);
        },
      );
    });

    test('Argument dispatch adalah object', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerSuccess('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jDispatch.mock.calls[0][0]).toEqual({
            type: 'modal/request/finish',
            payload: { message: 'Hello World' },
          });
        },
      );
    });

    test('Mutate Hanya dipanggil satu kali', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerSuccess('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jMutate.mock.calls.length).toBe(1);
        },
      );
    });

    test('Argument mutate hanya 1 buah', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerSuccess('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jMutate.mock.calls[0].length).toBe(1);
        },
      );
    });

    test('Argument mutate adalah /a', () => {
      const jDispatch = jest.fn();
      const jMutate = jest.fn();

      return clientHandlerSuccess('Hello World', jDispatch, jMutate, '/a').then(
        () => {
          expect(jMutate.mock.calls[0][0]).toBe('/a');
        },
      );
    });
  });
});

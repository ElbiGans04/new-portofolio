import { verifyJwt, signJwt } from '@src/utils/jwt';
import * as jose from 'jose';

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

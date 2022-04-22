import LoginController from '@src/controllers/login';
import joi from 'joi';
import { signJwt } from '@src/utils/jwt';
import Cookies from 'cookies';
import runMiddleware from '@src/middleware/runMiddleware';
import { NextApiResponse } from 'next';
import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import dayjs from 'dayjs';

jest.mock('joi', () => {
  const originalModule = jest.requireActual('joi');
  return {
    __esModule: true,
    default: {
      ...originalModule,
      attempt: jest.fn().mockReturnValue({
        id: 1,
        attributes: {
          email: 'rhafaelbijaksana04@gmail.com',
          password: 'elbigans04',
        },
      }),
    },
  };
});

jest.mock('@src/utils/jwt', () => {
  const originalModule = jest.requireActual('@src/utils/jwt');
  return {
    __esModule: true,
    ...originalModule,
    signJwt: jest.fn().mockResolvedValue('TOKEN'),
  };
});

jest.mock('cookies', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({ set: jest.fn() }),
  };
});

jest.mock('dayjs', () => {
  const originalModule = jest.requireActual('dayjs');
  return {
    __esModule: true,
    ...originalModule,
    default: jest
      .fn()
      .mockReturnValue({
        add: jest.fn().mockReturnThis(),
        toDate: jest.fn().mockReturnValue('DATE'),
      }),
  };
});

jest.mock('@src/middleware/runMiddleware', () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue(undefined),
  };
});

describe('POST LOGIN', () => {
  const req = {
    query: {
      toolID: 1,
    },
  } as unknown as RequestControllerRouter;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(undefined),
  };

  const runMiddlewareMock = runMiddleware as any as jest.Mock;
  const signJwtMock = signJwt as any as jest.Mock;
  const cookieMock = Cookies as any as jest.Mock;
  const dayjsMock = dayjs as any as jest.Mock;

  afterEach(() => {
    const set = cookieMock.mock.results[0].value.set as jest.Mock;
    const toDate = dayjsMock.mock.results[0].value.toDate as jest.Mock;
    const add = dayjsMock.mock.results[0].value.add as jest.Mock;
    set.mockClear();
    toDate.mockClear();
    add.mockClear();
    runMiddlewareMock.mockClear();
    signJwtMock.mockClear();
    cookieMock.mockClear();
    dayjsMock.mockClear();
    res.json.mockClear();
    res.status.mockClear();
  });

  test('memanggil runMiddleware sebanyak 1 kali', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls.length).toBe(1);
  });

  test('memanggil runMiddleware dengan 3 argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0].length).toBe(3);
  });

  test('memanggil runMiddleware dengan argument pertama berupa object', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][0]).toBeInstanceOf(Object);
  });

  test('memanggil runMiddleware dengan argument kedua berupa object', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][1]).toBeInstanceOf(Object);
  });

  test('memanggil runMiddleware dengan argument ketiga berupa function', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][2]).toBeInstanceOf(Function);
  });

  test('signJwtMock dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(signJwtMock.mock.calls.length).toBe(1);
  });

  test('signJwtMock dipanggil tanpa argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(signJwtMock.mock.calls[0].length).toBe(0);
  });

  test('Cookies dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(cookieMock.mock.calls.length).toBe(1);
  });

  test('Cookies dipanggil dengan 2 argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(cookieMock.mock.calls[0].length).toBe(2);
  });

  test('Cookies dipanggil dengan argument pertama bernilai object', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(cookieMock.mock.calls[0][0]).toEqual(req);
  });

  test('Cookies dipanggil dengan argument kedua bernilai object', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(cookieMock.mock.calls[0][1]).toEqual(res);
  });

  test('Cookies.set dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const set = cookieMock.mock.results[0].value.set as jest.Mock;
    expect(set.mock.calls.length).toBe(1);
  });

  test('Cookies.set dipanggil dengan 3 argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const set = cookieMock.mock.results[0].value.set as jest.Mock;
    expect(set.mock.calls[0].length).toBe(3);
  });

  test('Cookies.set dipanggil dengan argument pertama berupa refreshToken', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const set = cookieMock.mock.results[0].value.set as jest.Mock;
    expect(set.mock.calls[0][0]).toBe('refreshToken');
  });

  test('Cookies.set dipanggil dengan argument kedua berupa TOKEN', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const set = cookieMock.mock.results[0].value.set as jest.Mock;
    expect(set.mock.calls[0][1]).toBe('TOKEN');
  });

  test('Cookies.set dipanggil dengan argument ketiga berupa OBJECT', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const set = cookieMock.mock.results[0].value.set as jest.Mock;
    expect(set.mock.calls[0][2]).toEqual({
      overwrite: true,
      httpOnly: true,
      sameSite: 'lax',
      expires: 'DATE',
    });
  });

  test('dayjs dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(dayjsMock.mock.calls.length).toBe(1);
  });

  test('dayjs dipanggil tanpa argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(dayjsMock.mock.calls[0].length).toBe(0);
  });

  test('dayjs.add dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const add = dayjsMock.mock.results[0].value.add as jest.Mock;
    expect(add.mock.calls.length).toBe(1);
  });

  test('dayjs.add dipanggil dengan 2 argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const add = dayjsMock.mock.results[0].value.add as jest.Mock;
    expect(add.mock.calls[0].length).toBe(2);
  });

  test('dayjs.add dipanggil dengan argument pertama berupa 1', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const add = dayjsMock.mock.results[0].value.add as jest.Mock;
    expect(add.mock.calls[0][0]).toBe(1);
  });

  test('dayjs.add dipanggil dengan argument kedua berupa d', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const add = dayjsMock.mock.results[0].value.add as jest.Mock;
    expect(add.mock.calls[0][1]).toBe('d');
  });

  test('dayjs.toDate dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const toDate = dayjsMock.mock.results[0].value.toDate as jest.Mock;
    expect(toDate.mock.calls.length).toBe(1);
  });

  test('dayjs.toDate dipanggil tanpa argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    const toDate = dayjsMock.mock.results[0].value.toDate as jest.Mock;
    expect(toDate.mock.calls[0].length).toBe(0);
  });

  test('res.status dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(res.status.mock.calls.length).toBe(1);
  });

  test('res.status dipanggil dengan 2 argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(res.status.mock.calls[0].length).toBe(1);
  });

  test('res.status dipanggil dengan argument pertama bernilai object', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });

  test('res.json dipanggil 1x', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(res.json.mock.calls.length).toBe(1);
  });

  test('res.json dipanggil dengan 2 argument', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(res.json.mock.calls[0].length).toBe(1);
  });

  test('res.json dipanggil dengan argument pertama bernilai object', async () => {
    await LoginController.postLogin(req, res as unknown as NextApiResponse);
    expect(res.json.mock.calls[0][0]).toEqual({
      meta: { code: 200, isLoggedIn: true, title: 'success to login' },
    });
  });
});

describe('VALIDATION', () => {
  const attemp = joi.attempt as jest.Mock;

  beforeEach(() => {
    attemp.mockClear();
  });

  test('validation mengembalikan object', () => {
    expect(LoginController.validation({ name: 'rhafael', as: 'ok' })).toEqual({
      id: 1,
      attributes: {
        email: 'rhafaelbijaksana04@gmail.com',
        password: 'elbigans04',
      },
    });
  });

  test('joi.attempt dipanggil 1 kali', () => {
    LoginController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls.length).toBe(1);
  });

  test('joi.attempt dipanggil dengan 2 argument', () => {
    LoginController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0].length).toBe(2);
  });

  test('joi.attempt dipanggil dengan argument pertama berupa object', () => {
    LoginController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0][0]).toEqual({ name: 'rhafael', as: 'ok' });
  });

  test('joi.attempt dipanggil dengan argument kedua berupa object', () => {
    LoginController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0][1]).toBeInstanceOf(Object);
  });
});

export {};

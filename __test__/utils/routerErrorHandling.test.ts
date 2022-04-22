import routerErrorHandling from '@src/utils/routerErrorHandling';
import { NextApiResponse } from 'next';

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

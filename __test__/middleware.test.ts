import runMiddleware from '@src/middleware/runMiddleware';
import { NextApiResponse } from 'next';
import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import formidable, { Fields, Files, File } from 'formidable';
import { formidableHandler } from '@src/middleware/formidable';

jest.mock('formidable', () => {
  const originalModule = jest.requireActual('formidable');

  return {
    __esModule: true,
    ...originalModule,
    default: () => {
      return {
        parse: jest.fn(
          (
            req,
            cb: (err: Error | null, fields: Fields, files: Files) => void,
          ) => {
            cb(
              null,
              {
                name: 'rhafael',
              },
              {
                file: {} as File,
              },
            );
          },
        ),
      };
    },
  };
});

describe('runMiddleware utisls', () => {
  test('runMiddleware utisls  if success', () => {
    const req = {} as RequestControllerRouter;
    const res = {} as NextApiResponse;
    return runMiddleware(req, res, (req, res, fn) => {
      fn('Resolve');
    }).then((res) => {
      expect(res).toBe('Resolve');
    });
  });

  test('runMiddleware utisls  if failed', () => {
    const req = {} as RequestControllerRouter;
    const res = {} as NextApiResponse;
    return runMiddleware(req, res, (req, res, fn) => {
      fn(new Error('Hello World'));
    }).catch((err) => {
      expect(err).toBeInstanceOf(Error);
    });
  });
});

test('Formidable mengassign req.body dan req.files dengan nilai yang sesuai', (done) => {
  const req = {} as RequestControllerRouter;
  const res = {} as NextApiResponse;

  formidableHandler(req, res, (arg: any) => {
    expect(req.body).toEqual({ name: 'rhafael' });
    expect(req.files?.file).toBeDefined();
    done();
  });
});

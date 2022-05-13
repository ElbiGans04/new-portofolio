import Controller from '@src/controllers/tags';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import type { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import HttpError from '@src/utils/httpError';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function Tags(
  req: RequestControllerRouter,
  res: NextApiResponse,
) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        await Controller.getTags(req, res);
        break;
      case 'PATCH':
        await Controller.patchTag(req, res);
        break;
      case 'DELETE':
        await Controller.deleteTag(req, res);
        break;
      default:
        throw new HttpError(
          'request not support',
          406,
          'The requested HTTP method could not be fulfilled by the server',
        );
    }
  } catch (err) {
    routerErrorHandling(res, err);
  }
}

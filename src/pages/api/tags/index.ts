import type { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import { NextApiResponse } from 'next';
import HttpError from '@src/utils/httpError';
import dbConnect from '@src/database/connection';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import Controller from '@src/controllers/tags';

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

    await dbConnect();

    switch (method) {
      case 'GET':
        await Controller.getTags(req, res);
        break;
      case 'POST':
        await Controller.postTags(req, res);
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

import Controller from '@src/controllers/typeTools';
import dbConnect from '@src/database/connection';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import type { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import HttpError from '@src/utils/httpError';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function TypeTool(
  req: RequestControllerRouter,
  res: NextApiResponse,
) {
  try {
    const { method } = req;
    await dbConnect();

    switch (method) {
      case 'GET':
        await Controller.getTypeTool(req, res);
        break;
      case 'PATCH':
        await Controller.patchTypeTool(req, res);
        break;
      case 'DELETE':
        await Controller.deleteTypeTool(req, res);
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
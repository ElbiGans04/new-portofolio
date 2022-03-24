import Controller from '@src/controllers/tools';
import dbConnect from '@src/database/connection';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import HttpError from '@src/utils/httpError';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function Tool(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
) {
  try {
    const { method } = req;
    await dbConnect();

    if (method === 'GET') await Controller.getTool(req, res);
    else {
      switch (method) {
        case 'PATCH': {
          await Controller.patchTool(req, res);
          break;
        }
        case 'DELETE': {
          await Controller.deleteTool(req, res);
          break;
        }

        default:
          throw new HttpError(
            'request not support',
            406,
            'The requested HTTP method could not be fulfilled by the server',
          );
      }
    }
  } catch (err) {
    routerErrorHandling(res, err);
  }
}

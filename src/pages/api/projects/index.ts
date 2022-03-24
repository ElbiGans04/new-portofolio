import Controller from '@src/controllers/projects';
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
export default async function Projects(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === 'GET') await Controller.getProjects(req, res);
    else {
      // Lakukan operasi bedasarkan dari jenis http method
      switch (method) {
        case 'POST': {
          await Controller.postProjects(req, res);
          break;
        }
        default:
          throw new HttpError(
            'request not support',
            406,
            'The requested HTTP method could not be fulfilled by the server',
          );
          break;
      }
    }
  } catch (err) {
    routerErrorHandling(res, err);
  }
}

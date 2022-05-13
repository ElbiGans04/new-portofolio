import Controller from '@src/controllers/projects';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import type { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import HttpError from '@src/utils/httpError';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function Projects(
  req: RequestControllerRouter,
  res: NextApiResponse,
) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await Controller.getProjects(req, res);
        break;
      case 'POST':
        await Controller.postProjects(req, res);
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

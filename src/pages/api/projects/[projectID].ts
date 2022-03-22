import Controller from '@src/controllers/projects';
import dbConnect from '@src/database/connection';
import withIronSession from '@src/utils/withSession';
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

// Handler
export default withIronSession(
  async (req: RequestControllerRouter, res: RespondControllerRouter) => {
    try {
      const { method } = req;

      await dbConnect();

      if (method === 'GET') await Controller.getProject(req, res);
      else {
        if (req.session) {
          // Jika belum login
          if (!req.session.get('user')) {
            throw new HttpError(
              'please login ahead',
              403,
              "can't fulfill the request because access is not allowed",
            );
          }
        }

        switch (method) {
          case 'PATCH': {
            await Controller.patchProject(req, res);
            break;
          }
          case 'DELETE': {
            await Controller.deleteProject(req, res);
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
  },
);

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

export default withIronSession(
  async (req: RequestControllerRouter, res: RespondControllerRouter) => {
    const { method } = req;

    try {
      await dbConnect();

      if (method === 'GET') await Controller.getProjects(req, res);
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
    // res.json({vv:'s'})
  },
);

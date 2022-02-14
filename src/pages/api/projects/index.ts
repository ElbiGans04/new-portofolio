import Controller from '@controllers/projects';
import dbConnect from '@database/connection';
import withIronSession from '@middleware/withSession';
import { deleteTempFiles } from '@utils/files';
import routerErrorHandling from '@utils/routerErrorHandling';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
import HttpError from '@src/modules/httpError';

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
            if (req.headers['content-type'] !== 'application/vnd.api+json') {
              throw new HttpError(
                'content-type headers not supported',
                406,
                'if you try to send JSON:API document please you try to change the content-type headers to application/vnd.api+json',
              );
            }
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
      // Setiap Ada error semua file dalam tmp file
      await deleteTempFiles();
      routerErrorHandling(res, err);
    }
    // res.json({vv:'s'})
  },
);

import Controller from '@controllers/projects';
import dbConnect from '@database/connection';
import withIronSession from '@src/utils/withSession';
import ProjectService from '@controllers/projects.service';
import routerErrorHandling from '@utils/routerErrorHandling';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
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
            if (req.headers['content-type'] !== 'application/vnd.api+json') {
              throw new HttpError(
                'content-type headers not supported',
                406,
                'if you try to send JSON:API document please you try to change the content-type headers to application/vnd.api+json',
              );
            }
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
      await ProjectService.deleteTempFiles();
      routerErrorHandling(res, err);
    }
  },
);

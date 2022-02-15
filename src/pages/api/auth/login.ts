import Controller from '@controllers/login';
import withSession from '@src/utils/withSession';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import HttpError from '@src/modules/httpError';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withSession(
  async (req: RequestControllerRouter, res: RespondControllerRouter) => {
    try {
      if (req.method === 'POST') {
        if (req.headers['content-type'] !== 'application/vnd.api+json') {
          throw new HttpError(
            'content-type headers not supported',
            406,
            'if you try to send JSON:API document please you try to change the content-type headers to application/vnd.api+json',
          );
        }
        await Controller.postLogin(req, res);
        return;
      }

      throw new HttpError(
        'request not support',
        406,
        'The requested HTTP method could not be fulfilled by the server',
      );
    } catch (err) {
      routerErrorHandling(res, err);
    }
  },
);

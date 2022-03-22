import Controller from '@src/controllers/login';
import withSession from '@src/utils/withSession';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import routerErrorHandling from '@src/utils/routerErrorHandling';
import HttpError from '@src/utils/httpError';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withSession(
  async (req: RequestControllerRouter, res: RespondControllerRouter) => {
    try {
      if (req.method === 'POST') {
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

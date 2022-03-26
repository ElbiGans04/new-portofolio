import Controller from '@src/controllers/login';
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

export default async function Login(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
) {
  try {
    switch (req.method) {
      case 'GET':
        await Controller.postLogin(req, res);
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

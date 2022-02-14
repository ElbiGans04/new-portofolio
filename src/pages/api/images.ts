import Controller from '@controllers/images';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
import RouterErrorHandling from '@utils/routerErrorHandling';
import HttpError from '@src/modules/httpError';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function images(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
) {
  try {
    const contentType = req.headers['content-type']?.split(';')[0];

    if (contentType === 'multipart/form-data' && req.method === 'POST') {
      await Controller.postImages(req, res);
      return;
    }

    // Jika ga ada yang cocok
    throw new HttpError(
      'request not support',
      406,
      'The requested HTTP method could not be fulfilled by the server',
    );
  } catch (err) {
    RouterErrorHandling(res, err);
  }
}

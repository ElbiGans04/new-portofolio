import Controller from '@src/controllers/images';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import RouterErrorHandling from '@src/utils/routerErrorHandling';
import HttpError from '@src/utils/httpError';

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

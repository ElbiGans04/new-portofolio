import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';

class Images {
  async postImages(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);

    const images: Array<{ src: string }> = [];

    // Lakukan looping
    if (req.files && req.files.images) {
      if (Array.isArray(req.files.images)) {
        req.files.images.forEach((image) => {
          images.push({ src: image.newFilename });
        });
      } else {
        images.push({ src: req.files.images.newFilename });
      }
    }

    return res.json({ meta: { images } });
  }
}

export default new Images();

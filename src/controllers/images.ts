import { formidableHandler } from '@middleware/formidable';
import runMiddleware from "@middleware/runMiddleware";
import { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';

class Images {
    async postImages(req: RequestControllerRouter, res: RespondControllerRouter) {
        await runMiddleware(req, res, formidableHandler);
      
        let images: Array<{src: string}> = [];
        
        // Lakukan looping
        if (req.files && req.files.images) {
          if (Array.isArray(req.files.images)) {
            req.files.images.forEach((image) => {
              images.push({src: image.newFilename!});
            });
          } else {
            images.push({src: req.files.images.newFilename!})
          }
        }
    
        return res.json({meta: {images}});
    }
}



export default new Images();
import runMiddleware from "../../module/runMiddleware";
import { multer } from '../../../module/multer'

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function images () {
    const contentType = req.headers['content-type'].split(';')[0];

    if (contentType === 'multipart/form-data') {
        await runMiddleware(req, res, multer.array("images", 5));
        let images = [];
    
        // Lakukan looping
        req.files.forEach((image) => {
          images.push({src: image.filename});
        });
    
        return res.json({data: images});
    }

    return res.status(406).json({errors: [{title: 'request not support'}]})
}
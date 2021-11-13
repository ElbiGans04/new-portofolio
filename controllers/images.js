import runMiddleware from "../middleware/runMiddleware";
import {multer} from '../module/multer'
class Images {
    async postImages(req, res) {
        await runMiddleware(req, res, multer.array("images", 5));
        let images = [];
    
        // Lakukan looping
        req.files.forEach((image) => {
          images.push({src: image.filename});
        });
    
        return res.json({data: images});
    }
}



export default new Images();
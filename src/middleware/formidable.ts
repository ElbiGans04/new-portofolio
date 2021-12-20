import { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';
import formidable from 'formidable';
import path from 'path';
const form = formidable({
    multiples: true,
    filename: (name, ext, part, form) => {
      return `${name}-elbi-${Date.now()}.png`;
    },
    // filter: ({ name, originalFilename, mimetype }) => {
    //   return mimetype && mimetype.includes("image");
    // },
    uploadDir: path.resolve(process.cwd(), "./public/images/tmp"),
    maxFileSize: 3 * 1024 * 1024,
});

export default form;

export function formidableHandler (req: RequestControllerRouter, res: RespondControllerRouter, fn: (arg?: any) => void) {
    form.parse(req, (err, fields, files) => {
      if (err) return fn(err);
      
      // Jika ga errror
      req.files = files;
      req.body = fields
      fn();
    })
}
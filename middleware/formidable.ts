import formidable from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path'
import { RequestControllerRouter } from '../types/controllersRoutersApi';
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

export function formidableHandler (req: RequestControllerRouter, res: NextApiResponse, fn: (arg?: any) => void) {
    form.parse(req, (err, fields, files) => {
      if (err) return fn(err);
      
      // Jika ga errror
      req.files = files;
      req.body = fields
      fn();
    })
}
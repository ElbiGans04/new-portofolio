import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import path from 'path';
import formidable from 'formidable';
import { NextApiResponse } from 'next';

const form = formidable({
  multiples: true,
  filename: (name) => `${name}-elbi-${Date.now()}.png`,
  // filter: ({ name, originalFilename, mimetype }) => {
  //   return mimetype && mimetype.includes("image");
  // },
  uploadDir: path.resolve(process.cwd(), './public/images/tmp'),
  maxFileSize: 3 * 1024 * 1024,
});

export default form;

export function formidableHandler(
  req: RequestControllerRouter,
  res: NextApiResponse,
  fn: (arg?: any) => void,
) {
  form.parse(req, (err, fields, files) => {
    if (err) return fn(err);

    // Masukan kedalam properti agar dapat diakses dikemudian
    req.files = files;
    req.body = fields;
    fn();
  });
}

import Multer from 'multer'
import path from "path";
export const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    const currentDirectory = path.resolve(process.cwd(), "public/images/tmp");
    cb(null, currentDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `elbi-project-${uniqueSuffix}-${file.fieldname}.jpg`);
  },
});

export const multer = Multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
    files: 5,
  },
});
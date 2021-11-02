import dbConnect from "../../../database/connection";
import Project from "../../../database/schemas/projects";
import TypeProject from "../../../database/schemas/typeProject";
import Tools from "../../../database/schemas/tools";
import runMiddleware from "../../../lib/module/runMiddleware";
import { multer } from "../../../lib/module/multer";
import ProjectValidationSchema from "../../../lib/validation/projects";
import Joi from "joi";
import routerErrorHandling from "../../../lib/module/routerErrorHandling";
import { deleteTempFiles, moveImages } from "../../../lib/module/files";
import fsPromise from "fs/promises";
import path from "path";
import withIronSession from "../../../lib/module/withSession";
const pathImage = path.resolve(process.cwd(), "public/images");
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler
export default withIronSession(async function handler(req, res) {
  try {
    const { method } = req;
    const { projectID } = req.query;

    await dbConnect();

    if (method === "GET") {
      const result = await Project.findById(projectID)
        .populate("tools")
        .populate("typeProject");

      // jika ga ada
      if (!result) throw { message: "project not found", code: 404 };

      return res.json({ data: result });
    } else {

       // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({error: {message: 'please login ahead', code: 403}});

      switch (method) {
        case "PUT": {
          await runMiddleware(req, res, multer.array("images", 5));

          // Validasi
          const validReqBody = Joi.attempt(req.body, ProjectValidationSchema);

          // Jika hanya mengirim satu data tools
          if (validReqBody.tools instanceof Array === false) {
            validReqBody.tools = [validReqBody.tools];
          }

          // Check Apakah typeProject dengan id tertentu ada
          if ((await TypeProject.findById(validReqBody.typeProject)) === null) {
            throw { message: "invalid type project id", code: 404 };
          }

          // Cek apakah tools yang dimasukan terdaftar
          for (let tool of validReqBody.tools) {
            // cek jika tool
            if ((await Tools.findById(tool)) === null) {
              throw { message: "invalid tool id", code: 404 };
            }
          }

          // Buat untuk img
          const images = [];
          req.files.forEach((value) => {
            images.push({ src: value.filename });
          });

          // Ambil Daftar gambar lama
          const result2Old = await Project.findById(projectID, { images: 1 });

          // Update dan dapatkan data setelah update
          const newDokumen =
            images.length === 0
              ? { ...validReqBody }
              : { ...validReqBody, images };
          const result2 = await Project.findByIdAndUpdate(
            projectID,
            newDokumen,
            { new: true }
          );

          // Jika ga ada
          if (!result2Old) {
            throw { message: "project not found", code: 404 };
          }

          // Hapus gambar lama
          if (images.length > 0) {
            for (let image of result2Old.images) {
              await fsPromise.unlink(`${pathImage}/${image.src}`);
            }

            // pindahkan gambar
            await moveImages(images);
          }

          return res
            .status(200)
            .json({ meta: { message: "success update data" }, data: result2 });
        }
        case "DELETE": {
          const result = await Project.findByIdAndDelete(projectID);

          if (!result) throw { message: "project not found", code: 404 };

          // Hapus imagenya juga
          for (let image of result.images) {
            await fsPromise.unlink(`${pathImage}/${image.src}`);
          }

          return res
            .status(200)
            .json({ meta: { message: "success deleted" }, data: result });
        }
        default:
          throw { message: "method not found", code: 404 };
      }
    }
  } catch (err) {
    console.log(err)
    await deleteTempFiles();
    routerErrorHandling(res, err);
  }
})

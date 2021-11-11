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
import formatResource from "../../../lib/module/formatResource";
import bodyParser from "body-parser";

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
      if (!result) throw { title: "project not found", code: 404 };
  
      res.setHeader('content-type', 'application/vnd.api+json');
      res.statusCode = 200;
      return res.end(JSON.stringify({ data: formatResource(result, result.constructor.modelName), code: 200 }))
    } else {

       // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', code: 403}]});

      switch (method) {
        case "PATCH": {
          await runMiddleware(req, res, bodyParser.json({type: 'application/vnd.api+json'}));

          // Validasi
          const validReqBody = Joi.attempt(req.body, ProjectValidationSchema);

          // Jika tidak memasukan field id
          if(!validReqBody.id) throw {title: 'missing id property in request document', code: 404}

          // Jika hanya mengirim satu data tools
          if (validReqBody.attributes.tools instanceof Array === false) {
            validReqBody.attributes.tools = [validReqBody.attributes.tools];
          }

          // Check Apakah typeProject dengan id tertentu ada
          if ((await TypeProject.findById(validReqBody.attributes.typeProject)) === null) {
            throw { title: "invalid type project id", code: 404 };
          }

          // Cek apakah tools yang dimasukan terdaftar
          for (let tool of validReqBody.attributes.tools) {
            // cek jika tool
            if ((await Tools.findById(tool)) === null) {
              throw { title: "invalid tool id", code: 404 };
            }
          }

          // Ambil Daftar gambar lama
          const result2Old = await Project.findById(projectID, { images: 1 });

          const result2 = await Project.findByIdAndUpdate(
            projectID,
            validReqBody.attributes,
            { new: true }
          );

          // Jika ga ada
          if (!result2Old) {
            throw { title: "project not found", code: 404 };
          }

          // Hapus gambar lama
          if (images.length > 0) {
            for (let image of result2Old.images) {
              await fsPromise.unlink(`${pathImage}/${image.src}`);
            }

            // pindahkan gambar
            await moveImages(images);
          }

          res.setHeader('content-type', 'application/vnd.api+json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ meta: { title: "success update data", code: 200 }}))
        }
        case "DELETE": {
          const result = await Project.findByIdAndDelete(projectID);

          if (!result) throw { title: "project not found", code: 404 };

          // Hapus imagenya juga
          for (let image of result.images) {
            await fsPromise.unlink(`${pathImage}/${image.src}`);
          }

          res.setHeader('content-type', 'application/vnd.api+json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ meta: { title: "success deleted", code: 200 }}))
        }
        default:
          throw { title: "method not found", code: 404 };
      }
    }
  } catch (err) {
    console.log(err)
    await deleteTempFiles();
    routerErrorHandling(res, err);
  }
})

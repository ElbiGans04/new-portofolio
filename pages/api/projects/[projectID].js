import dbConnect from "../../../database/connection";
import Project from "../../../database/schemas/projects";
import TypeProject from "../../../database/schemas/typeProject";
import Tools from "../../../database/schemas/tools";
import runMiddleware from "../../../lib/module/runMiddleware";
import { multer } from "../../../lib/module/multer";
import ProjectValidationSchema from "../../../lib/validation/projects";
import Joi, { valid } from "joi";
import routerErrorHandling from "../../../lib/module/routerErrorHandling";


export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler
export default async function handler(req, res) {
  const { method } = req;
  const { projectID } = req.query;

  await dbConnect();

  try {
    switch (method) {
      case "GET":
        const result = await Project.findById(projectID)
          .populate("tools")
          .populate("typeProject");

        // jika ga ada
        if (!result) throw { message: "project not found", code: 404 }

        return res.json({ data: result });
      case "PUT":
        await runMiddleware(req, res, multer.array("images", 5));
        // Jika hanya mengirim satu data tools
        if (req.body.tools instanceof Array === false) {
          req.body.tools = [req.body.tools];
        }

        // Validasi
        const validReqBody = Joi.attempt(req.body, ProjectValidationSchema);

        // Check Apakah typeProject dengan id tertentu ada
        if ((await TypeProject.findById(validReqBody.typeProject)) === null) {
          throw { message: "invalid type project id", code: 404 }
        }

        // Cek apakah tools yang dimasukan terdaftar
        for (let tool of validReqBody.tools) {
          // cek jika tool
          if ((await Tools.findById(tool)) === null) {
            throw { message: "invalid tool id", code: 404 }
          }
        }

        // Buat untuk img
        const images = [];
        req.files.forEach((value) => {
          images.push({ src: value.filename });
        });

        // Jika jika ada
        const result2 = await Project.findByIdAndUpdate(
          projectID,
          {
            ...validReqBody,
            images
          },
          { new: true }
        );

        // Jika ga ada
        if (!result2) {
          throw { message: "project not found", code: 404 }
        }

        return res
          .status(200)
          .json({ meta: { message: "success update data" }, data: result2 });
      case "DELETE":
        const result3 = await Project.findByIdAndDelete(projectID);

        if (!result3)
          throw { message: "project not found", code: 404 };

        return res
          .status(200)
          .json({ meta: { message: "success deleted" }, data: result3 });

      default:
        throw { message: "method not found", code: 404 }
    }
  } catch (err) {
    routerErrorHandling(res, err)
  }
}

import dbConnect from "../../../database/connection";
import Project from "../../../database/schemas/projects";
import TypeProject from "../../../database/schemas/typeProject";
import Tools from "../../../database/schemas/tools";
import runMiddleware from '../../../lib/module/runMiddleware'
import { multer } from '../../../lib/module/multer'
import ProjectValidationSchema from '../../../lib/validation/projects'
import Joi, { valid } from 'joi'
import routerErrorHandling from "../../../lib/module/routerErrorHandling";


export const config = {
  api: {
    bodyParser: false,
  },
};



export default async function handler(req, res) {
  const { method } = req;

  try {
    await dbConnect();

    switch (method) {
      case "GET":
        const { type = "ALL", order = "ASC" } = req.query;
        let results;

        if (type === "ALL") {
          results = await Project.find()
            .sort({ title: order === "ASC" ? 1 : -1 })
            .populate("typeProject").populate('tools');
        } else {
          results = (
            await TypeProject.findOne({ _id: type })
              .sort({ title: order === "ASC" ? 1 : -1 })
              .populate({ path: "projects", populate: "typeProject" }).populate('tools')
          ).projects;
        }

        res.status(200).json({ data: results });

        break;
      case "POST":
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
        };

        // Buat untuk img
        const images = [];
        req.files.forEach((value) => {
          images.push({src: value.filename})
        });

        const project = new Project({
          ...validReqBody,
          images
        });

        await project.save()        
        res.status(201).json({meta : {message: 'The project has created'}});

        break;
      default:
        throw { message: "method not found", code: 404 }
        break;
    }
  } catch (err) {
    routerErrorHandling(res, err)
  }
  // res.json({vv:'s'})
}

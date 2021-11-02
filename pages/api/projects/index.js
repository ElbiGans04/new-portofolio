import dbConnect from "../../../database/connection";
import Project from "../../../database/schemas/projects";
import TypeProject from "../../../database/schemas/typeProject";
import Tools from "../../../database/schemas/tools";
import runMiddleware from '../../../lib/module/runMiddleware'
import { multer } from '../../../lib/module/multer'
import ProjectValidationSchema from '../../../lib/validation/projects'
import Joi from 'joi'
import routerErrorHandling from "../../../lib/module/routerErrorHandling";
import {deleteTempFiles, moveImages} from '../../../lib/module/files'
import withIronSession from '../../../lib/module/withSession'


export const config = {
  api: {
    bodyParser: false,
  },
};


export default withIronSession(async function handler(req, res) {
  const { method } = req;
  const { type = "ALL", order = "ASC" } = req.query;

  try {
    await dbConnect();

    if (method === 'GET') {
        let results = await Project.find()
          .sort({ title: order === "ASC" ? 1 : -1 })
          .populate("typeProject").populate('tools');

        res.status(200).json({ data: results });
    } else {

      // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({error: {message: 'please login ahead', code: 403}})
      
      // Lakukan operasi bedasarkan dari jenis http method
      switch (method) {
        case "POST": {
          await runMiddleware(req, res, multer.array("images", 5));
          
          // Validasi
          const validReqBody = Joi.attempt(req.body, ProjectValidationSchema);
  
          // Jika hanya mengirim satu data tools
          if (validReqBody.tools instanceof Array === false) {
            validReqBody.tools = [validReqBody.tools];
          }
  
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
  
          // Simpan Ke database
          const project = new Project({
            ...validReqBody,
            images
          });
  
          await project.save();
  
          // Pindahkan Gambar
          await moveImages(images);
  
          res.status(201).json({meta : {message: 'The project has created'}, data: project});
          break;
        }
        default:
          throw { message: "method not found", code: 404 }
          break;
      }
    }

  } catch (err) {
    console.log(err)
    // Setiap Ada error semua file dalam tmp file
    await deleteTempFiles()
    routerErrorHandling(res, err)
  }
  // res.json({vv:'s'})
})



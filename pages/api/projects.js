import dbConnect from "../../database/connection";
import Project from "../../database/schemas/projects";
import TypeProject from "../../database/schemas/typeProject";
// import Multer from 'multer'

// const multer = Multer({dest: '/temp'}).any()

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}


export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { type = "ALL", order = "ASC" } = req.query;
        let results;

        if (type === "ALL") {
          results = await Project.find()
            .sort({ title: order === "ASC" ? 1 : -1 })
            .populate("typeProject");
        } else {
          results = (
            await TypeProject.findOne({ _id: type })
              .sort({ title: order === "ASC" ? 1 : -1 })
              .populate({ path: "projects", populate: 'typeProject' })
          ).projects;
        }


        res.status(200).json({ success: true, data: results });
      
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        // await runMiddleware(req, res, multer)
        console.log(req.body);
        console.log(req.file)
        res.status(201).json({ success: true,});
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(405).json({ errors: { code: 405, title: 'method not found' } });
      break;
  }
  // res.json({vv:'s'})
}

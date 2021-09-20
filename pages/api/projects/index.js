import dbConnect from "../../../database/connection";
import Project from "../../../database/schemas/projects";
import TypeProject from "../../../database/schemas/typeProject";
import Tools from "../../../database/schemas/tools";
import Multer from "multer";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    const currentDirectory = path.resolve(process.cwd(), "public/images/tmp");
    cb(null, currentDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `elbi-project-${uniqueSuffix}-${file.fieldname}.jpg`);
  },
});

const multer = Multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
    files: 5,
  },
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

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

        // Check Apakah typeProject dengan id tertentu ada
        if ((await TypeProject.findById(req.body.typeProject)) === null) {
          return res
            .status(404)
            .json({ error: { message: "invalid type project id" } });
        }

        // Cek apakah tools yang dimasukan terdaftar
        for (let tool of req.body.tools) {
          // cek jika tool
          if ((await Tools.findById(tool)) === null) {
            return res
              .status(404)
              .json({ error: { message: `invalid tool with id ${tool}` } });
          }
        };

        // Buat untuk img
        const images = [];
        req.files.forEach((value) => {
          images.push({src: value.filename})
        });

        const project = new Project({
          title: req.body.title,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          tools: req.body.tools,
          typeProject: req.body.typeProject,
          images,
          description: req.body.description,
          url: req.body.url
        });

        await project.save()        
        res.status(201).json({meta : {message: 'The project has created'}});

        break;
      default:
        res
          .status(405)
          .json({ error: { code: 405, title: "method not found" } });
        break;
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: { message: err.data } });
  }
  // res.json({vv:'s'})
}

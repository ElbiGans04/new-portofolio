import dbConnect from "../../database/connection";
import Project from "../../database/schemas/projects";
import TypeProject from "../../database/schemas/typeProject";
import Multer from 'multer'
import path from 'path'


export const config = {
  api: {
    bodyParser: false,
  },
}


const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    const currentDirectory = path.resolve(process.cwd(), 'public/images/tmp');
    cb(null, currentDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `elbi-project-${uniqueSuffix}-${file.fieldname}.jpg`);
  }
});

const multer = Multer({storage: storage, limits: {
  fileSize: 1000000,
  files: 5,
}})

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
  const {
    title = "",
    startDate = Date.now(),
    endDate = Date.now(),
    tools = [],
    typeProject = 'A1',
    description = '',
    url = ''
  } = !req.body ? {} : req.body;
  try {
    await dbConnect();

    switch (method) {
      case "GET":
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
              .populate({ path: "projects", populate: "typeProject" })
          ).projects;
        }

        res.status(200).json({ data: results });

        break;
      case "POST":
        await runMiddleware(req, res, multer.array('images', 5));

        console.log(req.files)

        
        res.send("OK")
        break;
      default:
        res
          .status(405)
          .json({ errors: { code: 405, title: "method not found" } });
        break;
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ success: false });
  }
  // res.json({vv:'s'})
}

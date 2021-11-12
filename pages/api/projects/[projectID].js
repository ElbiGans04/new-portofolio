import dbConnect from "../../../database/connection";
import { deleteTempFiles } from "../../../module/files";
import routerErrorHandling from "../../../module/routerErrorHandling";
import withIronSession from "../../../module/withSession";
import Controller from '../../../controllers/projects'

export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler
export default withIronSession(async function handler(req, res) {
  try {
    const { method } = req;

    await dbConnect();

    if (method === "GET") await Controller.getProject(req, res);
    else {

       // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', code: 403}]});

      switch (method) {
        case "PATCH": {
          await Controller.patchProject(req, res);
          break;
        }
        case "DELETE": {
          await Controller.deleteProject(req, res);
          break;
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

import dbConnect from "@database/connection";
import { deleteTempFiles } from "@module/files";
import routerErrorHandling from "@module/routerErrorHandling";
import withIronSession from "@middleware/withSession";
import Controller from '@controllers/projects'
import { NextApiResponse } from 'next'
import type { NextIronSessionRequest } from '@typess/nextIronSession'
import type {Doc, DocErrors, DocMeta} from '@typess/jsonApi/index'

export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler
export default withIronSession(async function handler(req: NextIronSessionRequest, res: NextApiResponse<Doc | DocMeta | DocErrors>) {
  try {
    const { method } = req;

    await dbConnect();

    if (method === "GET") await Controller.getProject(req, res);
    else {

       // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', detail: `can't fulfill the request because access is not allowed`, status: '403'}]});

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

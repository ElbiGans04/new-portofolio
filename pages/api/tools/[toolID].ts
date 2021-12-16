import { NextApiResponse } from 'next';
import Controller from '../../../controllers/tools';
import dbConnect from "../../../database/connection";
import withIronSession from "../../../middleware/withSession";
import routerErrorHandling from "../../../module/routerErrorHandling";
import { Doc, DocErrors, DocMeta } from "../../../types/jsonApi";
import type { NextIronSessionRequest } from '../../../types/nextIronSession';

export const config = {
  api: {
    bodyParser: false,
  },
};


export default withIronSession(async function Handler(req: NextIronSessionRequest, res: NextApiResponse<Doc | DocMeta | DocErrors>) {
  try {
    const { method } = req;
    await dbConnect();

    if (method === "GET") await Controller.getTool(req, res);  
    else {

      // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', detail: `can't fulfill the request because access is not allowed`, status: '403'}]});

      switch (method) {
        case "PATCH": {
          await Controller.patchTool(req, res);
          break;
        }
        case "DELETE": {
          await Controller.deleteTool(req, res);
          break;
        }

        default:
          throw { code: 404, title: "method not found" };
          break;
      }
    }
  } catch (err) {
    routerErrorHandling(res, err);
  }
});

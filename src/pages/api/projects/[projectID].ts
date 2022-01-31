import Controller from "@controllers/projects";
import dbConnect from "@database/connection";
import withIronSession from "@middleware/withSession";
import { deleteTempFiles } from "@module/files";
import routerErrorHandling from "@module/routerErrorHandling";
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from "@typess/controllersRoutersApi";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler
export default withIronSession(async function handler(
  req: RequestControllerRouter,
  res: RespondControllerRouter
) {
  try {
    const { method } = req;

    await dbConnect();

    if (method === "GET") await Controller.getProject(req, res);
    else {

      if (req.session) {
        // Jika belum login
        if (!req.session.get("user"))
          return res
            .status(403)
            .json({
              errors: [
                {
                  title: "please login ahead",
                  detail: `can't fulfill the request because access is not allowed`,
                  status: "403",
                },
              ],
            });
      }

      switch (method) {
        case "PATCH": {
          if (req.headers["content-type"] !== "application/vnd.api+json")
            return res.status(406).json({
              errors: [
                {
                  title: "content-type headers not supported",
                  detail:
                    "if you try to send JSON:API document please you try to change the content-type headers to application/vnd.api+json",
                  status: "406",
                },
              ],
            });
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
    console.log(err);
    await deleteTempFiles();
    routerErrorHandling(res, err);
  }
});

import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";
import joi from "joi";
import ToolValidationSchema from "../../../lib/validation/tools";
import routerErrorHandling from "../../../lib/module/routerErrorHandling";
import withIronSession from "../../../lib/module/withSession";

export default withIronSession(async function Handler(req, res) {
  try {
    const { method } = req;
    const { toolID } = req.query;
    await dbConnect();

    if (method === "GET") {
      let result = await Tools.findById(toolID);

      // Jika tidak ada
      if (!result) throw { code: 404, message: "tool not found" };

      res.json({ data: result });
    } else {
      // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({error: {message: 'please login ahead', code: 403}});
      switch (method) {
        case "PUT": {
          let valid = joi.attempt(req.body, ToolValidationSchema);
          let result = await Tools.findByIdAndUpdate(toolID, valid).setOptions({
            new: true,
          });

          if (!result) throw { message: "tool not found", code: 404 };

          res.json({ meta: { message: "success updated" }, data: result });
          break;
        }
        case "DELETE": {
          let result = await Tools.findByIdAndDelete(toolID);

          if (!result) throw { message: "tool not found", code: 404 };

          res.json({ meta: { message: "success deleted" }, data: result });
          break;
        }

        default:
          throw { code: 404, message: "method not found" };
          break;
      }
    }
  } catch (err) {
    routerErrorHandling(res, err);
  }
});

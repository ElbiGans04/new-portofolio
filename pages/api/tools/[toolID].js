import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";
import joi from "joi";
import ToolValidationSchema from "../../../validation/tools";
import routerErrorHandling from "../../../module/routerErrorHandling";
import withIronSession from "../../../module/withSession";
import formatResource from "../../../module/formatResource";

export default withIronSession(async function Handler(req, res) {
  try {
    const { method } = req;
    const { toolID } = req.query;
    await dbConnect();

    if (method === "GET") {
      let result = await Tools.findById(toolID);

      // Jika tidak ada
      if (!result) throw { code: 404, title: "tool not found" };

      res.setHeader('content-type', 'application/vnd.api+json');
      res.statusCode = 200;
      return res.end(JSON.stringify({ data: formatResource(result, result.constructor.modelName), code: 200 }))
    } else {

      // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', code: 403}]});

      switch (method) {
        case "PATCH": {
          let valid = joi.attempt(req.body, ToolValidationSchema);

          if (!valid.attributes.id) throw { title: "missing id property in request document", code: 404 };

          let result = await Tools.findByIdAndUpdate(toolID, valid.attributes).setOptions({
            new: true,
          });

          if (!result) throw { title: "tool not found", code: 404 };

          res.setHeader('content-type', 'application/vnd.api+json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ meta: { title: "success updated", code: 200 }}))
          
          break;
        }
        case "DELETE": {
          let result = await Tools.findByIdAndDelete(toolID);

          if (!result) throw { title: "tool not found", code: 404 };

          res.setHeader('content-type', 'application/vnd.api+json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ meta: { title: "success deleted" }}))
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

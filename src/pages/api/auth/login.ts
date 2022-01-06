import Controller from "@controllers/login";
import withSession from "@middleware/withSession";
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from "@typess/controllersRoutersApi";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withSession(async function (
  req: RequestControllerRouter,
  res: RespondControllerRouter
) {
  if (req.method === "POST") {
    if (req.headers["content-type"] !== "application/vnd.api+json")
      return res
        .status(406)
        .json({
          errors: [
            {
              title: "content-type headers not supported",
              detail:
                "if you try to send JSON:API document please you try to change the content-type headers to application/vnd.api+json",
              status: "406",
            },
          ],
        });
    await Controller.postLogin(req, res);
    return;
  }

  return res
    .status(406)
    .json({
      errors: [
        {
          title: "method not support",
          status: "406",
          detail:
            "The requested HTTP method could not be fulfilled by the server",
        },
      ],
    });
});

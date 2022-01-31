import Controller from "@controllers/images";
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from "@typess/controllersRoutersApi";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function images(
  req: RequestControllerRouter,
  res: RespondControllerRouter
) {
  const contentType = req.headers["content-type"]?.split(";")[0];

  if (contentType === "multipart/form-data" && req.method === "POST") {
    await Controller.postImages(req, res);
    return;
  }

  res
    .status(406)
    .json({
      errors: [
        {
          title: "request not support",
          status: "406",
          detail:
            "The requested HTTP method could not be fulfilled by the server",
        },
      ],
    });
}

import { ValidationError } from "joi";
import { NextApiResponse } from "next";
import { DocErrors } from "../types/jsonApi";

export default function routerErrorHandling(
  res: NextApiResponse<DocErrors>,
  error: unknown
) {
  console.log(error);

  res
    .status(500)
    .json({
      errors: [
        {
          title: `error`,
          detail: "error",
          status: "500",
        },
      ],
    });
}

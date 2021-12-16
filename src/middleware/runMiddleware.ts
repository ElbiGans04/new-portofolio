import { NextApiResponse } from "next";
import { RequestControllerRouter } from "../types/controllersRoutersApi";
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export default function runMiddleware(
  req: RequestControllerRouter,
  res: NextApiResponse,
  fn: (
    req: RequestControllerRouter,
    res: NextApiResponse,
    fn: (result?: any) => void
  ) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

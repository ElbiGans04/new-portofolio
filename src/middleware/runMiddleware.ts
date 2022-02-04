import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export default function runMiddleware(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
  fn: (
    req: RequestControllerRouter,
    res: RespondControllerRouter,
    fn: (result?: any) => void,
  ) => void,
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

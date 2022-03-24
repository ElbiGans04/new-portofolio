import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import jwt from 'jsonwebtoken';

export default function User(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
) {
  if (!req.cookies.token) {
    return res.json({
      meta: {
        isLoggedIn: false,
      },
    });
  }

  if (!process.env.PUBLIC_KEY) throw new Error('Public key not found');
  jwt.verify(
    req.cookies.token,
    process.env.PUBLIC_KEY,
    { algorithms: ['RS256'] },
    function (err) {
      if (err) {
        return res.json({
          meta: {
            isLoggedIn: false,
          },
        });
      } else {
        return res.json({
          meta: {
            isLoggedIn: true,
          },
        });
      }
    },
  );
}

import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import * as jose from 'jose';

export default async function User(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
) {
  try {
    if (!req.cookies.token) {
      return res.json({
        meta: {
          isLoggedIn: false,
        },
      });
    }

    if (!process.env.PUBLIC_KEY) throw new Error('Public key not found');

    const publicKey = await jose.importSPKI(process.env.PUBLIC_KEY, 'RS256');
    await jose.jwtVerify(req.cookies.token, publicKey);

    return res.json({
      meta: {
        isLoggedIn: true,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      meta: {
        isLoggedIn: false,
      },
    });
  }
}

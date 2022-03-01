import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import runMiddleware from '@src/middleware/runMiddleware';
import { formidableHandler } from '@src/middleware/formidable';
import { isObject } from '@src/utils/typescript/narrowing';
import HttpError from '@src/utils/httpError';

class Login {
  async postLogin(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);

    const { attributes } = req.body;

    if (!isObject(attributes) || Array.isArray(attributes)) {
      throw new HttpError(
        'Entity not valid',
        406,
        'This happens because the email and password not sent to server',
      );
    }

    if (
      typeof attributes.email !== 'string' ||
      typeof attributes.password !== 'string'
    ) {
      throw new HttpError(
        'Type of password field and username field not supported',
        406,
        'Please send password field and username field as string',
      );
    }

    if (
      process.env.EMAIL !== attributes.email ||
      process.env.PW !== attributes.password
    ) {
      throw new HttpError(
        'password or email does not match',
        406,
        'This happens because the email and password sent is not the same as the one stored',
      );
    }

    if (req.session) {
      req.session.set('user', { isLoggedIn: true });
      await req.session.save();
    }

    return res.status(200).json({
      meta: { title: 'success to login', code: 200, isLoggedIn: true },
    });
  }
}

export default new Login();

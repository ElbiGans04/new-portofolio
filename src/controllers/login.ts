import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import runMiddleware from '@src/middleware/runMiddleware';
import { formidableHandler } from '@src/middleware/formidable';
import HttpError from '@src/utils/httpError';
import Joi from 'joi';
import { OObject } from '@src/types/jsonApi/object';

const LoginSchemaValidation = Joi.object({
  type: Joi.string().max(50).required(),
  id: Joi.string().max(100),
  attributes: Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(50).required(),
  }).required(),
}).required();

class Login {
  async postLogin(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);

    const { attributes } = this.validation(req.body);

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

  validation(body: { [index: string]: OObject }) {
    const valid = Joi.attempt(body, LoginSchemaValidation) as {
      type: string;
      id?: string;
      attributes: { email: string; password: string };
    };
    return valid;
  }
}

export default new Login();

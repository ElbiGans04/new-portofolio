import { RequestControllerRouter, RespondControllerRouter } from "@typess/controllersRoutersApi";
import { withIronSession } from "next-iron-session";

export default function withSession(handler: (req: RequestControllerRouter, res: RespondControllerRouter) => Promise<void>) {
    if (process.env.SECRET_COOKIE_PASSWORD === undefined) throw new Error('SECRET PASSWORD NOT FOUND'); 
    return withIronSession(handler, {
      password: process.env.SECRET_COOKIE_PASSWORD,
      cookieName: 'elbi',
      cookieOptions: {
        // the next line allows to use the session in non-https environments like
        // Next.js dev mode (http://localhost:3000)
        secure: process.env.NODE_ENV === 'production' ? true : false,
      },
    })
  }
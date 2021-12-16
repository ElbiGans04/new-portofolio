import { NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import { Doc, DocErrors, DocMeta } from "../types/jsonApi";
import { NextIronSessionRequest } from "../types/nextIronSession";

export default function withSession(handler: (req: NextIronSessionRequest, res: NextApiResponse<Doc | DocMeta | DocErrors>) => Promise<void>) {
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
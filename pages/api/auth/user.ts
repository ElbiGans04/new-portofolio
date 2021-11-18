import withSession from "../../../middleware/withSession";
import { NextApiResponse } from 'next'
import type { NextIronSessionRequest } from '../../../types/nextIronSession'

type Response = {
  meta: {
    isLoggedIn: boolean
  }
}

export default withSession(async function (req: NextIronSessionRequest, res: NextApiResponse<Response>) {
  const user = req.session.get('user')

  if (user) return res.json({
    meta: {
      isLoggedIn: true,
    }
  });

  return res.json({
    meta : {
      isLoggedIn: false,
    }
  })
})
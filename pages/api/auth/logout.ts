import withSession from "../../../middleware/withSession";
import { NextApiResponse } from 'next'
import type { NextIronSessionRequest } from '../../../types/nextIronSession'

export default withSession(async function (req: NextIronSessionRequest, res:NextApiResponse) {  
  await req.session.destroy();

  res.setHeader('cache-control', 'no-store, max-age=0');
  res.status(200).json({meta: {title: 'success', code: 200}})
})
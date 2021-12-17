import { NextApiResponse } from 'next';
import withSession from "@middleware/withSession";
import type { DocMeta } from '@typess/jsonApi/index';
import type { NextIronSessionRequest } from '@typess/nextIronSession';


export default withSession(async function (req: NextIronSessionRequest, res: NextApiResponse<DocMeta>) {
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
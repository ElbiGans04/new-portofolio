import { NextApiResponse } from 'next';
import withSession from "../../../middleware/withSession";
import type { DocMeta } from '../../../types/jsonApi/index';
import type { NextIronSessionRequest } from '../../../types/nextIronSession';

export default withSession(async function (req: NextIronSessionRequest, res:NextApiResponse<DocMeta>) {  
  await req.session.destroy();

  res.setHeader('cache-control', 'no-store, max-age=0');
  res.status(200).json({meta: {title: 'success', status: 200}})
})
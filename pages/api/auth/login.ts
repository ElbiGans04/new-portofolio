import { NextApiResponse } from 'next';
import Controller from '../../../controllers/login';
import withSession from "../../../middleware/withSession";
import type { DocErrors, DocMeta } from '../../../types/jsonApi/index';
import type { NextIronSessionRequest } from '../../../types/nextIronSession';

export default withSession(async function (req:NextIronSessionRequest, res:NextApiResponse<DocErrors | DocMeta>) {
  if (req.method === 'POST') {
   await Controller.postLogin(req, res); 
   return
  }

  return res.status(406).json({errors: [{title: 'method not support', status: '406', detail: 'The requested HTTP method could not be fulfilled by the server'}]})
});
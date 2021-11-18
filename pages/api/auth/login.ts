import withSession from "../../../middleware/withSession";
import Controller from '../../../controllers/login'
import { NextApiResponse } from 'next'
import type { NextIronSessionRequest } from '../../../types/nextIronSession'

export default withSession(async function (req:NextIronSessionRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
   await Controller.postLogin(req, res); 
   return
  }

  return res.status(406).json({errors: [{title: 'request not support'}]})
});
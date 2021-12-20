import Controller from '@controllers/login';
import withSession from "@middleware/withSession";
import type { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';

export default withSession(async function (req:RequestControllerRouter, res:RespondControllerRouter) {
  if (req.method === 'POST') {
   await Controller.postLogin(req, res); 
   return
  }

  return res.status(406).json({errors: [{title: 'method not support', status: '406', detail: 'The requested HTTP method could not be fulfilled by the server'}]})
});
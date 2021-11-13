import withSession from "../../middleware/withSession";
import Controller from '../../controllers/login'
export default withSession(async function (req, res) {
  if (req.method === 'POST') {
   await Controller.postLogin(req, res); 
   return
  }

  return res.status(406).json({errors: [{title: 'request not support'}]})
});
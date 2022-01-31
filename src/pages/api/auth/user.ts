import withSession from "@middleware/withSession";
import type { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';

export default withSession(async function (req: RequestControllerRouter, res: RespondControllerRouter) {
  const user = req.session ? req.session.get('user') : undefined ;  

  return res.json({
    meta : {
      isLoggedIn: user ? true : false,
    }
  })
})
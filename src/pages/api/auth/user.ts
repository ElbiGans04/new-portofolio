import withSession from "@middleware/withSession";
import type { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';

export default withSession(async function (req: RequestControllerRouter, res: RespondControllerRouter) {
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
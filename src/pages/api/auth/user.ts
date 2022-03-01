import withSession from '@src/utils/withSession';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';

export default withSession(
  (req: RequestControllerRouter, res: RespondControllerRouter) => {
    const user = req.session ? req.session.get<string>('user') : undefined;

    return res.json({
      meta: {
        isLoggedIn: !!user,
      },
    });
  },
);

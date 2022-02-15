import withSession from '@src/utils/withSession';
import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';

export default withSession(
  (req: RequestControllerRouter, res: RespondControllerRouter) => {
    if (req.session) req.session.destroy();

    res.setHeader('cache-control', 'no-store, max-age=0');
    res.status(200).json({ meta: { title: 'success', status: 200 } });
  },
);

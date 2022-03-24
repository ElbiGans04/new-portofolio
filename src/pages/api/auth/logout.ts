import type {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import Cookies from 'cookies';

export default function Logout(
  req: RequestControllerRouter,
  res: RespondControllerRouter,
) {
  const cookies = new Cookies(req, res);
  cookies.set('token', '', { expires: new Date('2020') });
  res.setHeader('cache-control', 'no-store, max-age=0');
  res.status(200).json({ meta: { title: 'success', status: 200 } });
}

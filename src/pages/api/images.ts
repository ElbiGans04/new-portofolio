import { NextApiResponse } from 'next';
import Controller from '@controllers/images';
import type { DocErrors, DocMeta } from '@typess/jsonApi';
import type { NextIronSessionRequest } from '../../types/nextIronSession';

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function images (req: NextIronSessionRequest, res: NextApiResponse<DocMeta | DocErrors>) {
    const contentType = req.headers['content-type']?.split(';')[0];

    if (contentType === 'multipart/form-data' && req.method === 'POST') {
      await Controller.postImages(req, res);
      return;
    }

    res.status(406).json({errors: [{title: 'method not support', status: '406', detail: 'The requested HTTP method could not be fulfilled by the server'}]})
}
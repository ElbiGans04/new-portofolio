import Controller from '../../controllers/images'
export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function images (req, res) {
    const contentType = req.headers['content-type'].split(';')[0];

    if (contentType === 'multipart/form-data' && req.method === 'POST') {
      await Controller.postImages(req, res);
      return;
    }

    return res.status(406).json({errors: [{title: 'request not support'}]})
}
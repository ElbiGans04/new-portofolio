import Controller from '@controllers/tools';
import dbConnect from "@database/connection";
import withIronSession from "@middleware/withSession";
import routerErrorHandling from "@module/routerErrorHandling";
import type { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default withIronSession(async function Handler (req: RequestControllerRouter, res: RespondControllerRouter) {
    try {
        const { method } = req;
    
        await dbConnect();

        if (method === 'GET') await Controller.getTools(req, res)   
        else {

            // Jika belum login
            if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', detail: `can't fulfill the request because access is not allowed`, status: '403'}]});

            switch (method) {
                case 'POST': {               
                    await Controller.postTools(req, res);
                    break;
                }
                    
                default: 
                    throw { code: 404, title: 'method not found' };
                    break;
            }
        }
    
    } catch (err) {
        routerErrorHandling(res, err)
    }
})
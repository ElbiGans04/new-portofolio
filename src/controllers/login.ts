import { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';
import runMiddleware from '@middleware/runMiddleware';
import {formidableHandler} from '@middleware/formidable'

class Login {
    async postLogin (req: RequestControllerRouter, res: RespondControllerRouter) {
        await runMiddleware(req, res, formidableHandler);
    
        const { attributes } = req.body;

        if (!attributes) return res.status(406).json({ errors: [{ title: "Entity not found", detail: 'This happens because the email and password not sent to server', status: '406' }] });
  
        if (process.env.EMAIL !== attributes.email || process.env.PW !== attributes.password)
          return res.status(404).json({ errors: [{ title: "password or email does not match", detail: 'This happens because the email and password sent is not the same as the one stored', status: '404' }] });
      
        req.session.set("user", {  isLoggedIn: true });
      
        await req.session.save();
        return res.status(200).json({
          meta: { title: "success to login", code: 200, isLoggedIn: true },
        });
    }
}


export default new Login()
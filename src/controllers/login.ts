import { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';

class Login {
    async postLogin (req: RequestControllerRouter, res: RespondControllerRouter) {
        const { email, password } = req.body as {email: string, password: string};
  
        if (process.env.EMAIL !== email || process.env.PW !== password)
          return res.status(404).json({ errors: [{ title: "password or email does not match", detail: 'This happens because the email and password sent is not the same as the one stored', status: '404' }] });
      
        req.session.set("user", {  isLoggedIn: true });
      
        await req.session.save();
        return res.status(200).json({
          meta: { title: "success to login", code: 200, isLoggedIn: true },
        });
    }
}


export default new Login()
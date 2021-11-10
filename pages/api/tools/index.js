import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";
import joi from 'joi'
import ToolValidationSchema from '../../../lib/validation/tools'
import routerErrorHandling from "../../../lib/module/routerErrorHandling";
import withIronSession from "../../../lib/module/withSession";
import formatResource from "../../../lib/module/formatResource";

export default withIronSession(async function Handler (req, res) {
    try {
        const { method } = req;
    
        await dbConnect();

        if (method === 'GET') {
            const results = await Tools.find();
            res.setHeader('content-type', 'application/vnd.api+json');
            res.statusCode = 200;
            return res.end(JSON.stringify({data: formatResource(results, results.constructor.modelName)}))
        } else {

            // Jika belum login
            if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', code: 403}]});

            switch (method) {
                case 'POST': {               
                    const valid = joi.attempt(req.body, ToolValidationSchema);
                    const tool = new Tools(valid.attributes);
                    await tool.save();
    
                    res.setHeader('content-type', 'application/vnd.api+json');
                    res.statusCode = 201;
                    return res.end(JSON.stringify({meta: {title: 'tool has created'}, data: formatResource(tool, tool.constructor.modelName)}))
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
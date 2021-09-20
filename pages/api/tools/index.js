import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";
import joi from 'joi'
import ToolValidationSchema from '../../../lib/validation/tools'
import routerErrorHandling from "../../../lib/module/routerErrorHandling";

export default async function Handler (req, res) {
    try {
        const { method } = req;
    
        await dbConnect();
    
        switch (method) {
            case 'GET': 
                const results = await Tools.find();

                res.json({data: results});
                break;
            case 'POST':
                const valid = joi.attempt(req.body, ToolValidationSchema);

                const tool = new Tools(valid);
                await tool.save();

                res.status(201).json({meta: {message: 'tool has created'}, data: tool})
                break;
            case 'DELETE': 
                await Tools.deleteMany({});
                res.status(200).json({meta: {message: 'tools has deleted'}})
                break;
                
            default: 
                throw { code: 404, message: 'method not found' };
                break;
        }
    } catch (err) {
        routerErrorHandling(res, err)
    }
}
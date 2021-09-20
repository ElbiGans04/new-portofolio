import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";
import joi from 'joi'
import ToolValidationSchema from '../../../lib/validation/tools'
import routerErrorHandling from "../../../lib/module/routerErrorHandling";

export default async function Handler (req, res) {
    try {
        const { method } = req;
        const { toolID } = req.query;
        let result;
    
        await dbConnect();
    
        switch (method) {
            case 'GET': 
                result = await Tools.findById(toolID);
                
                // Jika tidak ada
                if (!result) throw {code: 404, message: 'tool not found'};
                
                res.json({data: result})
                break;
            case 'PUT':
                let valid = joi.attempt(req.body, ToolValidationSchema)
                result = await Tools.findByIdAndUpdate(toolID, valid).setOptions({new: true});

                if (!result) throw {message: 'tool not found', code: 404};
        
                
                res.json({meta: {message: 'success updated'},data: result})
                break;

            case 'DELETE': 
                result = await Tools.findByIdAndDelete(toolID);

                if (!result) throw {message: 'tool not found', code: 404};
                
                res.json({meta: {message: 'success deleted'},data: result})
                break;
                
            default: 
                throw {code: 400, message: 'method not found'}
                break;
        }
    } catch (err) {
        routerErrorHandling(res, err)
    }
}
import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";

export default async function Handler (req, res) {
    try {
        const { method } = req;
        const { toolID } = req.query;
        const {name, as} = req.body;
        let result;
    
        await dbConnect();
    
        switch (method) {
            case 'GET': 
                result = await Tools.findById(toolID);
                
                // Jika tidak ada
                if (!result) throw {error: {code: 404, title: 'tool not found'}};
                
                res.json({data: result})
                break;
            case 'PUT':
                result = await Tools.findByIdAndUpdate(toolID, {name, as}).setOptions({new: true});

                if (!result) throw {error: {title: 'tool not found', code: 404}};
        
                
                res.json({meta: {message: 'success updated'},data: result})
                break;

            case 'DELETE': 
                result = await Tools.findByIdAndDelete(toolID);

                if (!result) throw {error: {title: 'tool not found', code: 404}};
                
                res.json({meta: {message: 'success updated'},data: result})
                break;
                
            default: 
                res.status(405).json({ errors: { code: 405, title: 'method not found' } });
                break;
        }
    } catch (err) {
        if (err instanceof Error) console.log(err);
        const code = err.error.code || 500;
        res.status(code).json({error: {title: err.error.title}})
    }
}
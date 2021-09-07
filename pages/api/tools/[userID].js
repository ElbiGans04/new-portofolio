import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";

export default async function Handler (req, res) {
    try {
        const { method } = req;
        const { userID } = req.query;
        const {name, as} = req.body;
        let result;
    
        await dbConnect();
    
        switch (method) {
            case 'GET': 
                result = await Tools.findById(userID);
                
                // Jika tidak ada
                if (!result) throw {code: 404, message: 'tool not found'};
                
                res.json({result})
                break;
            case 'PUT':
                result = await Tools.findByIdAndUpdate(userID, {name, as}).setOptions({new: true});
                
                res.json({result})
                break;

            case 'DELETE': 
                result = await Tools.findByIdAndDelete(userID);
                
                res.json({result})
                break;
                
            default: 
                res.status(405).json({ errors: { code: 405, title: 'method not found' } });
                break;
        }
    } catch (err) {
        if (err instanceof Error) console.log(err);
        const error = new Error(err.message || 'internal server error');
        const code = err.code || 500;
        res.status(code).json({error: {title: err.message}})
    }
}
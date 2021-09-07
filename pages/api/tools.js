import dbConnect from "../../database/connection";
import Tools from "../../database/schemas/tools";

export default async function Handler (req, res) {
    try {
        const { method } = req;
    
        await dbConnect();
    
        switch (method) {
            case 'GET': 
                const results = await Tools.find();
                res.json({results});
                break;
            case 'POST':
                const {name, as = ''} = req.body;
    
                if (!name) throw {code: 400, message: 'name field not present'}

                const tool = new Tools({name, as})
                await tool.save();

                res.status(201).json({meta: {message: 'tool has created'}})
                break;
                
            default: 
                res.status(405).json({ errors: { code: 405, title: 'method not found' } });
                break;
        }
    } catch (err) {
        const error = new Error(err.message || 'internal server error');
        const code = err.code || 500;
        console.log(error)
        res.status(code).json({error: {title: err.message}})
    }
}
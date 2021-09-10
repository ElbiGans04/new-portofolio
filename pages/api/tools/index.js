import dbConnect from "../../../database/connection";
import Tools from "../../../database/schemas/tools";

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
                const {name, as = ''} = req.body;
    
                if (!name) throw {error: {code: 400, title: 'name field not present'}}

                const tool = new Tools({name, as})
                await tool.save();

                res.status(201).json({meta: {message: 'tool has created'}})
                break;
            case 'DELETE': 
                await Tools.deleteMany({});
                res.status(200).json({meta: {message: 'tools has deleted'}})
                break;
                
            default: 
                res.status(405).json({ errors: { code: 405, title: 'method not found' } });
                break;
        }
    } catch (err) {
        const error = new Error(err.error.title || 'internal server error');
        const code = err.error.code || 500;
        console.log(error)
        res.status(code).json({error: {title: err.error.title}})
    }
}
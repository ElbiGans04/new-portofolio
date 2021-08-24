import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
    },
    description: String,
});


export default toolSchema
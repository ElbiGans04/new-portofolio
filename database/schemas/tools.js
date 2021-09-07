import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
    },
    as: {
        type: String,
        required: true,
    },
});


export default mongoose.models.Tools || mongoose.model('Tools', toolSchema)
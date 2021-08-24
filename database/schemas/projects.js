import mongoose from 'mongoose';
import tool from './tool';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    tools: [tool],
    typeProject: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});


export default mongoose.models.Projects || mongoose.model('Projects', projectSchema)
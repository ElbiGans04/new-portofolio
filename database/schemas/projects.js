import mongoose from 'mongoose';
import tool from './tool';
import image from './image';

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
    images: [image],
    description: {
        type: String,
        required: true,
    },
});


export default mongoose.models.Projects || mongoose.model('Projects', projectSchema)
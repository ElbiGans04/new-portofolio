import mongoose from 'mongoose';
import toolSchema from './tools';
import imageSchema from './image';
import typeProjectSchema from './typeProject';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    tools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tools' }],
    typeProject: { type: String, ref: 'typeProjects' },
    images: [imageSchema],
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});


export default mongoose.models.Projects || mongoose.model('Projects', projectSchema)
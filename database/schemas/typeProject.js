import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const typeProjectSchema = new mongoose.Schema({
    _id:  {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Projects' }]
});


export default mongoose.models.typeProjects || mongoose.model('typeProjects', typeProjectSchema)
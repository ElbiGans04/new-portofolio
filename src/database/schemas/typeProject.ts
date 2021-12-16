import mongoose, {Schema} from 'mongoose';
import typeProject from '../../types/mongoose/schemas/typeProject';

const typeProjectSchema = new Schema<typeProject>({
    _id:  {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});


export default mongoose.models.typeProjects as mongoose.Model<typeProject> || mongoose.model<typeProject>('typeProjects', typeProjectSchema)
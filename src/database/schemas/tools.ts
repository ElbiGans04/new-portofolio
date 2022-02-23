import toolType from '@typess/mongoose/schemas/tool';
import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema<toolType>({
  name: {
    type: String,
    required: true,
  },
  as: {
    type: String,
    required: true,
  },
});

export default (mongoose.models.Tools as mongoose.Model<toolType>) ||
  mongoose.model<toolType>('Tools', toolSchema);

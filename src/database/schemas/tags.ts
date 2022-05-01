import mongoose from 'mongoose';
import tags from '@src/types/mongoose/schemas/tag';

const tagSchema = new mongoose.Schema<tags>({
  name: {
    type: String,
    required: true,
  },
});

export default (mongoose.models.Tags as mongoose.Model<tags>) ||
  mongoose.model<tags>('Tags', tagSchema);

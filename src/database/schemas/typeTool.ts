import mongoose from 'mongoose';
import typeTools from '@src/types/mongoose/schemas/typeTool';

const TypeToolSchema = new mongoose.Schema<typeTools>({
  name: {
    type: String,
    required: true,
  },
});

export default (mongoose.models.TypeTool as mongoose.Model<typeTools>) ||
  mongoose.model<typeTools>('TypeTool', TypeToolSchema);

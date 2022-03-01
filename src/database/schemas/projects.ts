import projectType from '@src/types/mongoose/schemas/project';
import mongoose from 'mongoose';
import imageSchema from './image';

const projectSchema = new mongoose.Schema<projectType>({
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
  },
});

export default (mongoose.models
  .Projects as unknown as mongoose.Model<projectType>) ||
  mongoose.model<projectType>('Projects', projectSchema);

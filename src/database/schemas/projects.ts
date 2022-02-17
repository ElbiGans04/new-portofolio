import mongoose from 'mongoose';
import projectType from '@typess/mongoose/schemas/project';
import imageSchema from './image';
import imageInterface from '@typess/mongoose/schemas/image';

type modelProject = mongoose.Model<
  projectType,
  Record<string, never>,
  { images: mongoose.Types.DocumentArray<mongoose.Document<imageInterface>> }
>;
const projectSchema = new mongoose.Schema<projectType, modelProject>({
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

export default (mongoose.models.Projects as unknown as modelProject) ||
  mongoose.model<projectType, modelProject>('Projects', projectSchema);

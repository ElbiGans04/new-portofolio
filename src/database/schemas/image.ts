import mongoose from 'mongoose';
import images from '@src/types/mongoose/schemas/image';

const imageSchema = new mongoose.Schema<images>({
  src: {
    type: String,
    required: true,
  },
  ref: {
    type: String,
    required: true,
  },
});

export default imageSchema;

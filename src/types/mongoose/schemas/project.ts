import images from '@typess/mongoose/schemas/image';
import { Types } from 'mongoose';

export default interface project {
  _id: Types.ObjectId;
  title: string;
  startDate: Date;
  endDate: Date;
  tools: Types.Array<Types.ObjectId> | Types.ObjectId;
  typeProject: Types.ObjectId;
  images: images[];
  description: string;
  url: string;
}

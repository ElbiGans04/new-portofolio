import images from '@src/types/mongoose/schemas/image';
import tool from '@src/types/mongoose/schemas/tool';
import typeProject from '@src/types/mongoose/schemas/typeProject';
import { Types } from 'mongoose';

export default interface project {
  title: string;
  startDate: string;
  endDate: string;
  tools:
    | Types.Array<Types.ObjectId>
    | Types.ObjectId
    | tool
    | Types.Array<tool>;
  typeProject: string | typeProject;
  images: images[];
  description: string;
  url: string;
}

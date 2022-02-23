import images from '@typess/mongoose/schemas/image';
import tool from '@typess/mongoose/schemas/tool';
import typeProject from '@typess/mongoose/schemas/typeProject';
import { Types } from 'mongoose';

export default interface project {
  title: string;
  startDate: Date;
  endDate: Date;
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

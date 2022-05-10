import { Types } from 'mongoose';
import typeTool from './typeTool';
export default interface tool {
  _id: Types.ObjectId;
  name: string;
  as: string | typeTool;
}

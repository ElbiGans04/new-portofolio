import ProjectInterface from '@src/types/mongoose/schemas/project';
import ToolInterface from '@src/types/mongoose/schemas/tool';
import { Types } from 'mongoose';
import { isTool } from './typescript/narrowing';
import upperFirstWord from '@src/utils/upperFirstWord';

export default function getStringOfTools(data: ProjectInterface['tools']) {
  let result = '';
  data.forEach(function (value: Types.ObjectId | ToolInterface, index: number) {
    if (isTool(value)) {
      result += `${upperFirstWord(value.name)}`;
      if (value.as) result += ` as ${value.as}`;
      if (index !== data.length - 1) result += ', ';
      return;
    }

    result += `${value.toString()}`;

    // tambahkan koma
    if (index !== data.length - 1) result += ', ';
  });
  return result;
}

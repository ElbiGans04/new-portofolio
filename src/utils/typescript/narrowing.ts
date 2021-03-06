import { OObject } from '@src/types/jsonApi/object';
import { Types } from 'mongoose';
import toolSchmeInterface from '@src/types/mongoose/schemas/tool';

export function isObject(
  target: OObject,
): target is { [index: string]: OObject } {
  if (!Array.isArray(target) && target !== null && typeof target === 'object')
    return true;
  return false;
}

export function isTool(
  data: toolSchmeInterface | Types.ObjectId,
): data is toolSchmeInterface {
  return (data as toolSchmeInterface).name !== undefined;
}

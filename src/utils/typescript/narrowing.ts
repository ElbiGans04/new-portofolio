import { OObject } from '@src/types/jsonApi/object';

export function isObject(
  target: OObject,
): target is { [index: string]: OObject } {
  if (!Array.isArray(target) && target !== null && typeof target === 'object')
    return true;
  return false;
}

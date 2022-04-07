import formidable from 'formidable';
import { NextApiRequest } from 'next';
import { OObject } from './jsonApi/object';

export interface RequestControllerRouter extends NextApiRequest {
  files?: {
    [file: string]: formidable.File | formidable.File[];
  };
  body: {
    [index: string]: OObject;
  };
}

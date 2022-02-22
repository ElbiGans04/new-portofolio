import { DocData, DocErrors, DocMeta } from '@typess/jsonApi';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import { OObject } from './jsonApi/object';

export interface RequestControllerRouter extends NextApiRequest {
  files?: {
    [file: string]: formidable.File | formidable.File[];
  };
  body: {
    [index: string]: OObject;
  };
  session?: Session;
}

export type RespondControllerRouter<T = { [index: string]: OObject }> =
  NextApiResponse<DocData<T> | DocMeta | DocErrors>;

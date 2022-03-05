import type { ResourceObject } from '@src/types/jsonApi/index';
import { DocDataDiscriminated } from '@src/types/jsonApi/index';
import ProjectSchemaInterface from '@src/types/mongoose/schemas/project';
import ToolSchemaInterface from '@src/types/mongoose/schemas/tool';
import { Dispatch as ReactDispact } from 'react';

export type ResourceProjectInterface = ResourceObject<
  ProjectSchemaInterface,
  'Projects'
>;
export type ResourceToolInterface = ResourceObject<
  ToolSchemaInterface,
  'Tools'
>;

export type DATA = ResourceProjectInterface | ResourceToolInterface;

export type DocAdminData = DocDataDiscriminated<DATA[]>;

export interface admin {
  status: 'iddle' | 'loading' | 'error';
  modal: 'add' | 'update' | 'delete' | null;
  message: string | null;
  row: DATA | null;
}

export type action =
  | { type: 'modal/open/add' }
  | {
      type: 'modal/open/update';
      payload: DATA;
    }
  | {
      type: 'modal/open/delete';
      payload: DATA;
    }
  | { type: 'modal/request/start' }
  | {
      type: 'modal/request/finish';
      payload: {
        message: string;
      };
    }
  | { type: 'modal/close' };

export type Dispatch = ReactDispact<action>;

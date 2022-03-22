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

type baseAdmin = {
  status: 'iddle' | 'loading' | 'error';
  message: string | null;
};

export type admin =
  | (baseAdmin & {
      modal: null;
      row: null;
    })
  | (baseAdmin & {
      modal: 'add';
      row: null;
    })
  | (baseAdmin & {
      modal: 'update';
      row: DATA;
    })
  | (baseAdmin & {
      modal: 'delete';
      row: DATA;
    });

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

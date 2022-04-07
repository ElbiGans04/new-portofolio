import type { ResourceObject } from '@src/types/jsonApi/index';
import { DocDataDiscriminated } from '@src/types/jsonApi/index';
import ProjectSchemaInterface from '@src/types/mongoose/schemas/project';
import ToolSchemaInterface from '@src/types/mongoose/schemas/tool';
import TypeProjectSchemaInterface from '@src/types/mongoose/schemas/typeProject';
import { Dispatch as ReactDispact } from 'react';

export type ResourceProjectInterface = ResourceObject<
  ProjectSchemaInterface,
  'Project',
  'tools' | 'typeProject'
>;

export type RelationshipProjectInterface =
  | ResourceObject<ToolSchemaInterface, 'tool', ''>
  | ResourceObject<TypeProjectSchemaInterface, 'typeProject', ''>;

export type DocProject = DocDataDiscriminated<
  ResourceProjectInterface,
  RelationshipProjectInterface
>;

export type DocProjects = DocDataDiscriminated<
  ResourceProjectInterface[],
  RelationshipProjectInterface
>;

export type ResourceToolInterface = ResourceObject<
  ToolSchemaInterface,
  'Tool',
  ''
>;

export type DocTool = DocDataDiscriminated<ResourceToolInterface>;

export type DocTools = DocDataDiscriminated<ResourceToolInterface[]>;

export type DocAdminDataSingular = DocTool | DocProject;

export type DocAdminDataPlural = DocTools | DocProjects;

export type DocAdminDataMix = DocProject | DocTool | DocProjects | DocTools;

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
      row: DocAdminDataSingular;
    })
  | (baseAdmin & {
      modal: 'delete';
      row: DocAdminDataSingular;
    });

export type action =
  | { type: 'modal/open/add' }
  | {
      type: 'modal/open/update';
      payload: DocAdminDataSingular;
    }
  | {
      type: 'modal/open/delete';
      payload: DocAdminDataSingular;
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

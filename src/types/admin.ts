import type { ResourceObject } from '@src/types/jsonApi/index';
import { DocDataDiscriminated } from '@src/types/jsonApi/index';
import ProjectSchemaInterface from '@src/types/mongoose/schemas/project';
import ToolSchemaInterface from '@src/types/mongoose/schemas/tool';
import TypeProjectSchemaInterface from '@src/types/mongoose/schemas/typeProject';
import TagsSchemaInterface from '@src/types/mongoose/schemas/tag';
import TypeToolsSchemaInterface from '@src/types/mongoose/schemas/typeTool';
import { Dispatch as ReactDispact } from 'react';

export type ResourceProjectInterface = ResourceObject<
  ProjectSchemaInterface,
  'Project',
  'tools' | 'typeProject',
  'tool' | 'typeProject'
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
  '',
  'tool'
>;

export type DocTool = DocDataDiscriminated<ResourceToolInterface>;

export type DocTools = DocDataDiscriminated<ResourceToolInterface[]>;

export type ResourceTagInterface = ResourceObject<
  TagsSchemaInterface,
  'Tag',
  '',
  'tag'
>;

export type DocTag = DocDataDiscriminated<ResourceTagInterface>;

export type DocTags = DocDataDiscriminated<ResourceTagInterface[]>;

export type ResourceTypeToolsInterface = ResourceObject<
  TypeToolsSchemaInterface,
  'TypeTool',
  '',
  'TypeTool'
>;

export type DocTypeTool = DocDataDiscriminated<ResourceTypeToolsInterface>;

export type DocTypeTools = DocDataDiscriminated<ResourceTypeToolsInterface[]>;

export type DocAdminDataSingular = DocTool | DocProject | DocTag | DocTypeTool;

export type DocAdminDataPlural =
  | DocTools
  | DocProjects
  | DocTags
  | DocTypeTools;

export type DocAdminDataMix =
  | DocProject
  | DocTool
  | DocProjects
  | DocTools
  | DocTag
  | DocTags;

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

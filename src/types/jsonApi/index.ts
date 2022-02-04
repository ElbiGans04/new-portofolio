import type { error } from '@typess/jsonApi/error';
import type { meta } from '@typess/jsonApi/meta';
import type { link } from '@typess/jsonApi/link';
import type { OObject, OObjectWithFiles } from '@typess/jsonApi/object';

type jsonApi = {
  version: string;
  meta?: meta;
};

type ResourceIdentifierObjects = {
  type: string;
  id: string;
  meta?: meta;
};

export type ResourceObject = ResourceIdentifierObjects & {
  attributes: {
    [index: string]: OObject;
  };
  relationships?: {
    [index: string]: {
      links?: {
        self?: string;
        related?: {
          href: string;
          meta?: meta;
        };
      };
      meta?: meta;
      data?:
        | ResourceIdentifierObjects
        | null
        | ResourceIdentifierObjects[]
        | [];
    };
  };
  links?: {
    self: string;
  };
};

export type ResourceObjectForSend = {
  id?: string;
  type: string;
  meta?: meta;
  attributes: {
    [index: string]: OObject;
  };
  relationships?: {
    [index: string]: {
      links?: {
        self?: string;
        related?: {
          href: string;
          meta?: meta;
        };
      };
      meta?: meta;
      data?:
        | ResourceIdentifierObjects
        | null
        | ResourceIdentifierObjects[]
        | [];
    };
  };
  links?: {
    self: string;
  };
};

export type ResourceObjectForSendWithFiles = {
  id?: string;
  type: string;
  meta?: meta;
  attributes: {
    [index: string]: OObjectWithFiles;
  };
  relationships?: {
    [index: string]: {
      links?: {
        self?: string;
        related?: {
          href: string;
          meta?: meta;
        };
      };
      meta?: meta;
      data?:
        | ResourceIdentifierObjects
        | null
        | ResourceIdentifierObjects[]
        | [];
    };
  };
  links?: {
    self: string;
  };
};

//  Dokumen
type baseDoc =
  | {
      jsonapi?: jsonApi;
    }
  | {
      links?:
        | link
        | {
            first: string | null;
            last: string | null;
            next: string | null;
            prev: string | null;
          };
    };

export type Doc = {
  data: ResourceObject | null | ResourceObject[] | never[];
  included?: ResourceObject[];
  meta?: meta;
};

export type DocMeta = { meta: meta } & baseDoc;

export type DocErrors = { errors: Array<error>; meta?: meta } & baseDoc;

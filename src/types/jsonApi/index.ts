import { OObject } from './object';

/*
    Additional
*/

type MetaObject = {
  [index: string]: OObject;
};

type link =
  | string
  | {
      href: string;
      meta: MetaObject;
    };

interface ResourceIdentifierObject {
  type: string;
  id: string;
  meta?: MetaObject;
}

export interface ResourceObject<T = { [index: string]: OObject }> {
  type: string;
  id?: string;
  attributes?: T;
  relationships?: {
    [index: string]: {
      links: {
        self: link;
        related?: link;
      };
      data:
        | ResourceIdentifierObject
        | null
        | ResourceIdentifierObject[]
        | never[];
      meta?: MetaObject;
    };
  };
  links?: {
    self?: link;
  };
  meta?: MetaObject;
}

/* 
    TOP LEVEL MEMBER
*/

interface DocBase {
  jsonapi?: {
    version?: string;
    meta?: MetaObject;
  };
  links?: {
    self?: link;
    related?: link;
    pagination?: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
  };
}

export interface DocData<T = { [index: string]: OObject }> extends DocBase {
  data:
    | ResourceObject<T>
    | ResourceObject<T>[]
    | null
    | never[]
    | ResourceIdentifierObject
    | ResourceIdentifierObject[];
  meta?: MetaObject;
  included?: Array<{
    type: string;
    id?: string;
    attributes: {
      [index: string]: OObject;
    };
  }>;
}

export interface DocMeta extends DocBase {
  meta: MetaObject;
}

export interface DocErrors extends DocBase {
  errors: Array<{
    id?: string;
    links?: {
      about: string;
    };
    status: string;
    code?: string;
    title: string;
    detail: string;
    source?: {
      pointer: string;
    };
    meta?: MetaObject;
  }>;
  meta?: MetaObject;
}

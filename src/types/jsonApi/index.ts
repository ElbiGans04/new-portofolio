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

export interface ResourceObject<
  T = { [index: string]: OObject },
  T2 = string,
  T3 = Record<string, unknown>,
> {
  type: T2;
  id: string;
  attributes?: {
    [Property in keyof T as Exclude<Property, '__v' | '_id'>]: T[Property];
  };
  relationships?: {
    [Property in keyof T3]: {
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

export interface DocData<T = { [index: string]: OObject }, T2 = string>
  extends DocBase {
  data:
    | ResourceObject<T, T2>
    | ResourceObject<T, T2>[]
    | null
    | never[]
    | ResourceIdentifierObject
    | ResourceIdentifierObject[];
  meta?: MetaObject;
  included?: Array<ResourceObject>;
}

/* 
  Discriminated Uunions. Memperluas fungsi DocDoc.
  Tujuan agar halaman admin bisa melakukan discriminated-unions terhadap data yang dikirim
  
  # CONTOH PENGGUNAAN JIKA TYPE ARGUMENT BERUPA UNION YANG DAPAT ARRAY atau Object tunggal
  interface Human {
    name: number,
    age: number
  }
  
  interface Animal {
    color: string
  }
  type DATA = ResourceObject<Human, "human"> | ResourceObject<Animal, "animal">;
  const test: DocDataDiscriminated<DATA[] | DATA> = {
    data: [{
      type: "human"
    }]
  }
*/
export interface DocDataDiscriminated<
  T = { [index: string]: OObject },
  T2 = { [index: string]: OObject },
> extends DocBase {
  data: T;
  meta?: MetaObject;
  included?: Array<T2>;
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

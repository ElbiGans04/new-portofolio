import type { OObject } from '@src/types/jsonApi/object';

interface Data {
  id: string;
  columns: string[];
  columnsValue: OObject[];
}
export interface admin {
  status: 'iddle' | 'loading' | 'error';
  modal: 'add' | 'update' | 'delete' | null;
  message: string | null;
  row: Data | null;
}

export type action =
  | { type: 'modal/open/add' }
  | {
      type: 'modal/open/update';
      payload: { id: string; columns: string[]; columnsValue: OObject[] };
    }
  | {
      type: 'modal/open/delete';
      payload: { id: string; columns: string[]; columnsValue: OObject[] };
    }
  | { type: 'modal/request/start' }
  | {
      type: 'modal/request/finish';
      payload: {
        message: string;
      };
    }
  | { type: 'modal/close' };

import { Dispatch, createContext } from 'react';
import { OObject } from '@src/types/jsonApi/object';

type ContextType =
  | {
      url: string;
      dispatch: Dispatch<any>;
      columns: string[];
      visible: { visibleColumns: string[]; visibleValue: number };
      renameColumns: {
        [index: string]: string;
      };
      specialTreatment: {
        [index: string]: (value: OObject) => JSX.Element | string;
      };
    }
  | false;

const context = createContext<ContextType>(false);

export default context;

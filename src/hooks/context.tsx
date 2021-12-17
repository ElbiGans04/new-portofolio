import { Dispatch, createContext } from "react";
import { OObject } from '@typess/jsonApi/object';

const context = createContext<{
  url: string;
  dispatch?: Dispatch<any>
  columns?: string[];
  visible?: { visibleColumns: string[]; visibleValue: number },
  renameColumns?: {
    [index: string]: string;
  },
  specialTreatment?: {
    [index: string]: (value: OObject) => JSX.Element | string
  }
}>({
  url: "",
  columns: [],
  visible: { visibleColumns: [], visibleValue: 0 },
  renameColumns: {},
  specialTreatment: {},
});

export default context;

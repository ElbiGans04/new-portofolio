export type OObject =
  | string
  | number
  | boolean
  | null
  | OObject[]
  | { [key: string]: OObject };
export type OObjectWithFiles = OObject | File | FileList;

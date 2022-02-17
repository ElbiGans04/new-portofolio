export type TransformToDoc<Type> = {
  type: string;
  id?: string;
  attributes: {
    [Property in keyof Type as Exclude<
      Property,
      '__v' | '_id'
    >]: Type[Property];
  };
};

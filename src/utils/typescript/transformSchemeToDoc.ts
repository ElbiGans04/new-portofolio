export type TransformToDocServer<Type> = {
  type: string;
  id: string;
  attributes: {
    [Property in keyof Type as Exclude<
      Property,
      '__v' | '_id'
    >]: Type[Property];
  };
};

export type TransformToDocClient<Type> = {
  [Property in keyof TransformToDocServer<Type> as Exclude<
    Property,
    'id'
  >]: TransformToDocServer<Type>[Property];
};

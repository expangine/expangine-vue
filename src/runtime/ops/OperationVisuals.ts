

export type OperationVisuals<
  P extends string = any,
  O extends string = any,
  S extends string = any,
> = {
  name: string;
  description: string;
  singleline: string;
  comments: Record<P | O, string>;
  returnComments?: string;
  keywords?: string[];
} & (
  [O] extends [never] ? {} : { defaults: Record<O, string> }
) & (
  [S] extends [never] ? {} : { scopeComments: Record<S, string> }
);

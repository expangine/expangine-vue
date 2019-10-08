

export interface OperationVisuals<
  P extends string = any,
  O extends string = any,
  S extends string = any,
> {
  name: string;
  description: string;
  singleline: string;
  comments: Record<P | O, string>;
  scopeComments?: Record<S, string>;
  returnComments?: string;
}



export abstract class Data
{

  public abstract async get(path: any[]): Promise<any>;

  public abstract async set(path: any[], value: any): Promise<void>;

  public abstract async remove(path: any[]): Promise<void>;

  public abstract async add(path: any[], value: any): Promise<void>;

  public abstract async clear(path: any[]): Promise<void>;

  public abstract async query(path: any[], options?: DataQueryOptions): Promise<DataQuery>;

}

export interface DataQuery
{
  results: Array<[any, any]>;
  total: number;
}

export interface DataQueryOptions
{
  filters?: DataFilter[];
  filtersOr?: boolean;
  orders?: DataOrder[];
  size?: number;
  offset?: number;
}

export enum DataFilterOperation
{
  EQUALS, LESS_THAN, LESS_THAN_EQUAL, MORE_THAN, MORE_THAN_EQUAL, MATCHES,
}

export interface DataFilter
{
  property: string;
  operation: DataFilterOperation;
  not?: boolean;
  value: any;
}

export enum DataOrderDirection
{
  ASC, DESC,
}

export interface DataOrder
{
  property: string;
  direction?: DataOrderDirection;
}

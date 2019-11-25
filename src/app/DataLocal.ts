
import Vue from 'vue';
import { isArray, isNumber, isString, compare, isObject, isMap } from 'expangine-runtime';
import { Data, DataQueryOptions, DataQuery, DataOrderDirection, DataFilterOperation, DataFilter } from './Data';



export class DataLocal extends Data
{

  public source: any;

  public async get(path: any[]): Promise<any> 
  {
    let node = this.source;

    for (const segment of path)
    {
      node = this.internalGet(node, segment);

      if (node === null)
      {
        return null;
      }
    }

    return node;
  }  
  
  public async set(path: any[], value: any): Promise<void> 
  {
    if (path.length === 0)
    {
      this.source = value;
    }

    const beforePath = path.slice();
    const key = beforePath.pop();
    const before = await this.get(beforePath);

    if (before !== null && key !== undefined)
    {
      this.internalSet(before, key, value);
    }
  }

  public async remove(path: any[]): Promise<void>
  {
    if (path.length === 0)
    {
      this.source = isArray(this.source) 
        ? []
        : isMap(this.source)
          ? new Map()
          : isObject(this.source)
            ? {}
            : null;
    }

    const beforePath = path.slice();
    const key = beforePath.pop();
    const before = await this.get(beforePath);

    if (before !== null && key !== undefined)
    {
      this.internalRemove(before, key);
    }
  }

  public async add(path: any[], value: any): Promise<void>
  {
    const list = await this.get(path);

    if (isArray(list))
    {
      list.push(value);
    }
  }

  public async clear(path: any[]): Promise<void>
  {
    const value = await this.get(path);

    if (isArray(value))
    {
      value.splice(0, value.length);
    }
    else if (isMap(value))
    {
      value.clear();
    }
    else if (isObject(value))
    {
      for (const prop in value)
      {
        Vue.delete(value, prop);
      }
    }
  }

  public async query(path: any[], options?: DataQueryOptions | undefined): Promise<DataQuery> 
  {
    const list = await this.get(path);

    if (!isArray(list)) 
    {
      return { total: 0, results: [] };
    }

    if (!options) 
    {
      return { total: list.length, results: list };
    }

    let results = list;

    const filters = options.filters;

    if (filters && filters.length > 0) 
    {
      const matchDefault = options.filtersOr ? false : true;

      results = results.filter((a) => 
      {
        let match = matchDefault;

        for (const filter of filters) 
        {
          const value = this.internalGet(a, filter.property);
          const filterMatch = this.filterMatch(value, filter);
          
          match = options.filtersOr
            ? match || filterMatch
            : match && filterMatch;
        }

        return match;
      });
    }

    const orders = options.orders;

    if (orders && orders.length > 0) 
    {
      results.sort((a, b) => 
      {
        for (const order of orders) 
        {
          const { property, direction } = order;
          const avalue = this.internalGet(a, property);
          const bvalue = this.internalGet(b, property);

          const compared = compare(avalue, bvalue);

          if (compared !== 0) 
          {
            return direction === DataOrderDirection.DESC ? -compared : compared;
          }
        }

        return 0;
      });
    }

    const total = results.length;

    if (isNumber(options.offset)) 
    {
      results = results.slice(options.offset);
    }

    if (isNumber(options.size)) 
    {
      results = results.slice(0, options.size);
    }

    return { total, results };
  }

  private internalGet(node: any, key: any) 
  {
    if (isMap(node)) 
    {
      return node.get(key);
    }

    if (isArray(node)) 
    {
      return node[key as number];
    }

    if (isObject(node)) 
    {
      return node[key];
    }

    return null;
  }

  private internalSet(node: any, key: any, value: any)
  {
    if (isMap(node))
    {
      node.set(key, value);
    }

    if (isArray(node))
    {
      Vue.set(node, key, value);
    }

    if (isObject(node))
    {
      Vue.set(node, key, value);
    }
  }

  private internalRemove(node: any, key: any)
  {
    if (isMap(node))
    {
      node.delete(key);
    }

    if (isArray(node))
    {
      if (isNumber(key))
      {
        node.splice(key, 1);
      }
      else
      {
        Vue.delete(node, key);
      }
    }

    if (isObject(node))
    {
      Vue.delete(node, key);
    }
  }

  private filterMatch(value: any, filter: DataFilter): boolean 
  {
    switch (filter.operation) 
    {
      case DataFilterOperation.EQUALS:
        return (compare(value, filter.value) === 0) === !filter.not;
      case DataFilterOperation.LESS_THAN:
        return (compare(value, filter.value) < 0) === !filter.not;
      case DataFilterOperation.LESS_THAN_EQUAL:
        return (compare(value, filter.value) <= 0) === !filter.not;
      case DataFilterOperation.MORE_THAN:
        return (compare(value, filter.value) > 0) === !filter.not;
      case DataFilterOperation.MORE_THAN_EQUAL:
        return (compare(value, filter.value) >= 0) === !filter.not;
      case DataFilterOperation.MATCHES:
        return (filter.value instanceof RegExp && isString(value) && !!value.match(filter.value)) === !filter.not;
    }

    return !!filter.not;
  }

}

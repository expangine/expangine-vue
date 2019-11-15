

// tslint:disable: max-classes-per-file


export interface TrieKeyHandler<K> 
{
  empty: K;
  length: (a: K) => number;
  equals: (a: K, b: K) => boolean;
  subset: (a: K, start: number, endExclude?: number) => K;
}

export const TrieKeyStringSensitive: TrieKeyHandler<string> =
{
  empty: '',
  length: (a) => a.length,
  equals: (a, b) => a === b,
  subset: (a, start, endExclude) => a.substring(start, endExclude),
};

export const TrieKeyStringInsensitive: TrieKeyHandler<string> =
{
  empty: '',
  length: (a) => a.length,
  equals: (a, b) => a.toLowerCase() === b.toLowerCase(),
  subset: (a, start, endExclude) => a.substring(start, endExclude),
};

export const TrieKeyArray: TrieKeyHandler<any[]> = 
{
  empty: [],
  length: (a) => a.length,
  equals: (a, b) => a.length === b.length && !a.some((ae, ai) => ae !== b[ai]),
  subset: (a, start, end) => a.slice(start, end),
};


export class Trie<T, K = string>
{

  public static strings<T>(caseSensitive: boolean = true, initial?: Record<string, T> | Map<string, T>): Trie<T, string>
  {
    const trie = new Trie<T, string>(caseSensitive ? TrieKeyStringSensitive : TrieKeyStringInsensitive);

    if (initial)
    {
      if (initial instanceof Map)
      {
        for (const [key, value] of initial.entries())
        {
          trie.set(key, value);
        }
      }
      else
      {
        for (const key in initial)
        {
          trie.set(key, initial[key]);
        }
      }
    }

    return trie;
  }

  public static arrays<T, E = any>(initial?: Array<[E[], T]>): Trie<T, E[]>
  {
    const trie = new Trie<T, E[]>(TrieKeyArray);

    if (initial)
    {
      initial.forEach(([key, value]) => trie.set(key, value));
    }

    return trie;
  }

  public root: TrieNode<T, K>;
  public handler: TrieKeyHandler<K>;

  public constructor(handler: TrieKeyHandler<K>)
  {
    this.handler = handler;
    this.root = new TrieNode<T, K>(handler.empty, handler);
  }

  public set(key: K, value: T)
  {
    this.root.set(key, value);
  }

  public add(key: K, value: T, add: (value: T, existing: T) => T)
  {
    this.root.add(key, value, add);
  }

  public has(key: K): boolean
  {
    return this.root.get(key) !== undefined;
  }

  public get(key: K): T | undefined
  {
    return this.root.get(key);
  }

  public match(key: K, min: number, max: number, onMatch: (match: T, key: K, amount: number) => any)
  {
    if (key)
    {
      this.root.match(key, min, max, onMatch);
    }
  }

  public startsWith(key: K, include: boolean, onMatch: (match: T, key: K, amount: number) => any)
  {
    if (key)
    {
      this.root.match(key, include ? 1 : 1.000001, 2147483647, onMatch);
    }
  }

  public lessThan(key: K, include: boolean, onMatch: (match: T, key: K, amount: number) => any)
  {
    if (key)
    {
      this.root.match(key, 0, include ? 1 : 0.999999, onMatch);
    }
  }

  public each(callback: (value: T, key: K) => any)
  {
    this.root.each(callback);
  }

  public keys(): K[]
  {
    const result: K[] = [];

    this.each((value, key) => result.push(key));

    return result;
  }

  public values(): T[]
  {
    const result: T[] = [];

    this.each((value, key) => result.push(value));

    return result;
  }

  public entries(): Array<[K, T]>
  {
    const result: Array<[K, T]> = [];

    this.each((value, key) => result.push([key, value]));

    return result;
  }

}

export class TrieNode<T, K = string>
{

  public value?: T;
  public key: K;
  public handler: TrieKeyHandler<K>;
  public children: Map<K, TrieNode<T, K>>;

  public constructor(key: K, handler: TrieKeyHandler<K>, value?: T)
  {
    this.key = key;
    this.handler = handler; 
    this.value = value;
    this.children = new Map();
  }

  public set(key: K, value: T)
  {
    const node = this.getNode(key, value);

    node.value = value;
  }

  public get(key: K): T | undefined
  {
    const node = this.getNode(key);

    return node ? node.value : undefined;
  }

  public add(key: K, value: T, add: (value: T, existing: T) => T)
  {
    const node = this.getNode(key);

    if (node) 
    {
      node.value = node.value !== undefined ? add(value, node.value) : value;
    }
    else 
    {
      this.getNode(key, value);
    }
  }

  public each(callback: (value: T, key: K) => any)
  {
    if (this.value !== undefined)
    {
      callback(this.value, this.key);
    }

    for (const [childKey, child] of this.children.entries())
    {
      child.each(callback);
    }
  }

  public match(key: K, min: number, max: number, onMatch: (match: T, key: K, amount: number) => any)
  {
    const { handler, children } = this;

    const keyLength = handler.length(key);
    const thisKeyLength = handler.length(this.key);

    const minLength = Math.min(keyLength, thisKeyLength);
    const minMatch = handler.equals(
      handler.subset(this.key, 0, minLength),
      handler.subset(key, 0, minLength),
    );
    
    if (minMatch)
    {
      const amount = thisKeyLength / keyLength;

      if (this.value !== undefined && amount >= min && amount <= max)
      {
        onMatch(this.value, this.key, amount);
      }

      if (amount >= max)
      {
        return;
      }

      const start = handler.length(this.key);

      for (let i = start + 1; i <= keyLength; i++)
      {
        const childKeyTest = handler.subset(key, start, i);
        const child = children.get(childKeyTest);

        if (child)
        {
          child.match(key, min, max, onMatch);

          return;
        }
      }

      const childKey = handler.subset(key, start);

      for (const [otherKey, child] of children.entries())
      {
        if (handler.equals(handler.subset(otherKey, 0, handler.length(childKey)), childKey))
        {
          child.match(key, min, max, onMatch);

          return;
        }
      }
    }
  }

  protected getNode(key: K): TrieNode<T, K> | null;
  protected getNode(key: K, createWithValue: T): TrieNode<T, K>;
  protected getNode(key: K, createWithValue?: T): TrieNode<T, K> | null;
  protected getNode(key: K, createWithValue?: T): TrieNode<T, K> | null
  {
    const { handler, children } = this;

    if (handler.equals(this.key, key))
    {
      return this;
    }

    const keyLength = handler.length(key);
    const start = handler.length(this.key);

    for (let i = start + 1; i <= keyLength; i++)
    {
      const childKey = handler.subset(key, start, i);
      const child = children.get(childKey);

      if (child)
      {
        return child.getNode(key, createWithValue);
      }
    }

    if (createWithValue !== undefined)
    {
      const childKey = handler.subset(key, start);
      const child = new TrieNode<T, K>(key, handler, createWithValue);

      for (const [otherKey, other] of children)
      {
        if (handler.equals(handler.subset(otherKey, 0, handler.length(childKey)), childKey))
        {
          const otherChildKey = handler.subset(other.key, keyLength);

          child.children.set(otherChildKey, other);
          children.delete(otherKey);

          break;
        }
      }

      children.set(childKey, child);

      return child;
    }

    return null;
  }

}

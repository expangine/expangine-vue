

// tslint:disable: max-classes-per-file

export class Trie<T>
{

  public root: TrieNode<T>;

  public constructor(initial?: Record<string, T>)
  {
    this.root = new TrieNode<T>('');

    if (initial)
    {
      for (const key in initial)
      {
        this.set(key, initial[key]);
      }
    }
  }

  public set(key: string, value: T)
  {
    this.root.set(key, value);
  }

  public get(key: string): T | undefined
  {
    return this.root.get(key);
  }

  public match(key: string, min: number, max: number, onMatch: (match: T, key: string, amount: number) => any)
  {
    if (key)
    {
      this.root.match(key, min, max, onMatch);
    }
  }

  public add(key: string, value: T, add: (value: T, existing: T) => T)
  {
    this.root.add(key, value, add);
  }

}

export class TrieNode<T>
{

  public value?: T;
  public key: string;
  public children: Record<string, TrieNode<T>>;

  public constructor(key: string, value?: T)
  {
    this.value = value;
    this.key = key;
    this.children = {};
  }

  public set(key: string, value: T)
  {
    const node = this.getNode(key, value);

    node.value = value;
  }

  public get(key: string): T | undefined
  {
    const node = this.getNode(key);

    return node ? node.value : undefined;
  }

  public add(key: string, value: T, add: (value: T, existing: T) => T)
  {
    const node = this.getNode(key);

    if (node && node.value) 
    {
      node.value = node.value !== undefined ? add(value, node.value) : value;
    } 
    else 
    {
      this.getNode(key, value);
    }
  }

  public match(key: string, min: number, max: number, onMatch: (match: T, key: string, amount: number) => any)
  {
    const minLength = Math.min(key.length, this.key.length);
    const minMatch = this.key.substring(0, minLength) === key.substring(0, minLength);
    
    if (minMatch)
    {
      const amount = this.key.length / key.length;

      if (this.value !== undefined && amount >= min && amount <= max)
      {
        onMatch(this.value, this.key, amount);
      }

      if (amount >= max)
      {
        return;
      }

      const start = this.key.length;

      for (let i = start + 1; i <= key.length; i++)
      {
        const childKeyTest = key.substring(start, i);
        const child = this.children[childKeyTest];

        if (child)
        {
          child.match(key, min, max, onMatch);

          return;
        }
      }

      const childKey = key.substring(start);

      for (const otherKey in this.children)
      {
        if (otherKey.substring(0, childKey.length) === childKey)
        {
          this.children[otherKey].match(key, min, max, onMatch);

          return;
        }
      }
    }
  }

  protected getNode(key: string): TrieNode<T> | null;
  protected getNode(key: string, createWithValue: T): TrieNode<T>;
  protected getNode(key: string, createWithValue?: T): TrieNode<T> | null;
  protected getNode(key: string, createWithValue?: T): TrieNode<T> | null
  {
    if (this.key === key)
    {
      return this;
    }

    const start = this.key.length;

    for (let i = start + 1; i <= key.length; i++)
    {
      const childKey = key.substring(start, i);
      const child = this.children[childKey];

      if (child)
      {
        return child.getNode(key, createWithValue);
      }
    }

    if (createWithValue !== undefined)
    {
      const childKey = key.substring(start);
      const child = new TrieNode<T>(key, createWithValue);

      for (const otherKey in this.children)
      {
        if (otherKey.substring(0, childKey.length) === childKey)
        {
          const other = this.children[otherKey];
          const otherChildKey = other.key.substring(key.length);

          child.children[otherChildKey] = other;

          delete this.children[otherKey];

          break;
        }
      }

      this.children[childKey] = child;

      return child;
    }

    return null;
  }

}


export class LinkedNode<T> 
{

  public value: T;
  public next: LinkedNode<T>;
  public prev: LinkedNode<T>;

  constructor(value: T) 
  {
    this.value = value;
    this.next = this.prev = this;
  }

  // List Operations

  public isEmpty()
  {
    return this.next === this;
  }

  public clear() 
  {
    this.next = this.prev = this;
  }

  public addLast(value: T): LinkedNode<T> 
  {
    const node = new LinkedNode(value);
    node.linkAfter(this.prev);
    return node;
  }

  public addFirst(value: T): LinkedNode<T> 
  { 
    const node = new LinkedNode(value);
    node.linkAfter(this);
    return node;
  }

  public each(callback: (value: T, index: number, node: LinkedNode<T>) => any): number 
  {
    const stop = this;
    let curr = this.next;
    let count = 0;

    while (curr !== stop) 
    {
      const next = curr.next;
      callback(curr.value, count, curr);
      curr = next;
      count++;
    }

    return count;
  }

  // Item Operations

  public isRemoved()
  {
    return this.next === this;
  }

  public remove() 
  {
    if (!this.isRemoved()) 
    {
      this.next.prev = this.prev;
      this.prev.next = this.next;
      this.next = this.prev = this;
    }
  }

  public linkAfter(node: LinkedNode<T>) 
  {
    this.remove();
    this.next = node.next;
    this.prev = node;
    node.next.prev = this;
    node.next = this;
  }

}

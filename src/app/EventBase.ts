import { LinkedNode } from './LinkedNode';
import { isArray } from 'expangine-runtime';



export type EventCallback<
  E, 
  K extends keyof E = any, 
  A extends any[] = EventTypeArgs<E, K>,
  R = EventTypeResult<E, K>  
> = (type: K, ...payload: A) => R;

export type EventDefinition<A extends any[], R> = (...args: A) => R;

export type EventCallbackMap<E> = 
{
  [K in keyof E]?: LinkedNode<EventCallback<E, K>>
};

export type EventTypeResult<E, K extends keyof E> =
  E[K] extends EventDefinition<any, infer R>
    ? R
    : never;

export type EventTypeArgs<E, K extends keyof E> =
  E[K] extends EventDefinition<infer A, any>
    ? A
    : never;

export class EventBase<E> 
{

  private listeners: EventCallbackMap<E> = Object.create(null);

  public trigger<K extends keyof E, A extends EventTypeArgs<E, K>, R extends EventTypeResult<E, K>>(event: K, ...payload: A): R[] 
  {
    const listeners = this.getListeners(event);
    const results: R[] = [];

    if (listeners) 
    { 
      listeners.each((listener) => results.push(listener(event, ...payload) as R));
    }

    return results;
  }

  public hasListeners<K extends keyof E>(event: K): boolean
  {
    return this.getListeners(event) !== null;
  }

  public getListeners<K extends keyof E>(event: K, create?: false): LinkedNode<EventCallback<E, K>> | null;
  public getListeners<K extends keyof E>(event: K, create: true): LinkedNode<EventCallback<E, K>>;
  public getListeners<K extends keyof E>(event: K, create: boolean = true): LinkedNode<EventCallback<E, K>> | null 
  {
    let listeners: LinkedNode<EventCallback<E, K>> | undefined = this.listeners[event];

    if (!listeners && create) 
    {
      listeners = this.listeners[event] = new LinkedNode<EventCallback<E, K>>(() => undefined as EventTypeResult<E, K>);
    }

    return listeners || null;
  }

  public on<K extends keyof E>(event: K | K[], handler: EventCallback<E, K>): () => void 
  {
    const events = isArray(event) ? event : [event];
    const nodes = events.map((e) => this.getListeners(e, true).addLast(handler));
    
    return () => nodes.forEach((n) => n.remove());
  }

  public once<K extends keyof E>(event: K | K[], handler: EventCallback<E, K>): () => void 
  {
    const off = this.on(event, (type, ...payload) => {
      off();
      return handler(type, ...payload);
    });

    return off;
  }

  public off<K extends keyof E = any>(event?: K | K[], handler?: EventCallback<E, K>): this 
  {
    if (event) 
    {
      if (Array.isArray(event)) 
      {
        event.forEach((e) => this.off(e, handler));
      } 
      else 
      {
        const listeners = this.listeners[event];

        if (listeners) 
        {
          if (handler) 
          {
            listeners.each((other, index, node) => {
              if (other === handler) {
                node.remove();
              }
            });
          }
          else 
          {
            listeners.clear();
          }
        }
      }
    } 
    else 
    {
      this.listeners = Object.create(null);
    }

    return this;
  }

}

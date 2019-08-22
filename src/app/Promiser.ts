
export type PromiseResolve<T> = (result?: T | PromiseLike<T>) => void;

export type PromiseReject = (error?: any) => void;

export interface Promiser<T> 
{
  resolve: PromiseResolve<T>;
  reject: PromiseReject;
  promise: Promise<T>;
}

export function getPromiser<T>(): Promiser<T> 
{
  let resolve: PromiseResolve<T> = () => { /**/ };
  let reject: PromiseReject = () => { /**/ };

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { resolve, reject, promise }; 
}

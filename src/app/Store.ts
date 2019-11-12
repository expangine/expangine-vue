import localForage from 'localforage';
import { getPromiser } from './Promiser';


export const Store = 
{
  async get(key: string): Promise<any> 
  {
    const { promise, resolve } = getPromiser<any>();
    
    localForage.getItem(key, (err, value) => {
      resolve(value);
    });

    return promise;
  },
  async set(key: string, value: any): Promise<any> 
  {
    return localForage.setItem(key, value);
  },
  async remove(key: string): Promise<any> 
  {
    return localForage.removeItem(key);
  },
  async clear(): Promise<any> 
  {
    return localForage.clear();
  },
};

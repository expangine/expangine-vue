import localForage from 'localforage';


export const Store = 
{
  async get(key: string): Promise<any> 
  {
    return localForage.getItem(key);
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

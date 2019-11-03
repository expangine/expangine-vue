
import { getPromiser } from './Promiser';
import { SimpleFieldSettings } from '@/common';

export interface SimpleInputOptions<T = any>
{
  persistent: boolean;
  title: string;
  message: string;
  value: T;
  fields: SimpleFieldSettings<T>;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  handle: (confirmed: boolean) => void;
}

export function getSimpleInputDefaults<T = any>(): SimpleInputOptions<T> {
  return {
    persistent: true,
    title: 'Input',
    message: '',
    value: null as unknown as T,
    fields: [],
    confirm: 'Ok',
    unconfirm: 'Cancel',
    visible: false,
    handle: () => { /* */ },
  };
}

export const simpleInputDialog = getSimpleInputDefaults();

export async function getSimpleInput<T = any>(options: Partial<SimpleInputOptions<T>> = {}): Promise<T | null> 
{
  const { resolve, promise } = getPromiser<T | null>();

  Object.assign(simpleInputDialog, getSimpleInputDefaults());
  Object.assign(simpleInputDialog, options);

  simpleInputDialog.visible = true;
  simpleInputDialog.handle = (confirmed: boolean) => {
    simpleInputDialog.visible = false;
    confirmed ? resolve(simpleInputDialog.value) : resolve(null);
  };

  return promise;
}

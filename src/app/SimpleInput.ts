
import { getPromiser } from './Promiser';
import { SimpleFieldSettings } from '@/common';
import { getMultipleDialoger } from './MultipleDialog';

export interface SimpleInputOptions<T = any>
{
  persistent: boolean;
  title: string;
  message: string;
  value: T;
  fields: SimpleFieldSettings<T>;
  focus: 'first' | 'confirm';
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
    focus: 'first',
    confirm: 'Ok',
    unconfirm: 'Cancel',
    visible: false,
    handle: () => { /* */ },
  };
}

export const simpleInputDialog = getSimpleInputDefaults();

export const simpleInputMultiplier = getMultipleDialoger(simpleInputDialog);

export async function getSimpleInput<T = any>(options: Partial<SimpleInputOptions<T>> = {}): Promise<T | null> 
{
  const { resolve, promise } = getPromiser<T | null>();

  simpleInputMultiplier.open(() =>
  {
    Object.assign(simpleInputDialog, getSimpleInputDefaults());
    Object.assign(simpleInputDialog, options);

    simpleInputDialog.handle = (confirmed: boolean) => 
    {
      confirmed ? resolve(simpleInputDialog.value) : resolve(null);

      simpleInputMultiplier.close();
    };
  });

  return promise;
}

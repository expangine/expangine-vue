
import { getPromiser } from './Promiser';

export interface InputOptions
{
  title: string;
  message: string;
  value: string;
  label: string;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  handle: (confirmed: boolean) => void;
}

export function getInputDefaults(): InputOptions {
  return {
    title: 'Input',
    message: 'Please enter a value',
    label: '',
    value: '',
    confirm: 'Ok',
    unconfirm: 'Cancel',
    visible: false,
    handle: () => { /* */ },
  };
}

export const inputDialog = getInputDefaults();

export async function getInput(options: Partial<InputOptions> = {}): Promise<string | null> 
{
  const { resolve, promise } = getPromiser<string | null>();

  Object.assign(inputDialog, getInputDefaults());
  Object.assign(inputDialog, options);

  inputDialog.visible = true;
  inputDialog.handle = (confirmed: boolean) => {
    inputDialog.visible = false;
    confirmed ? resolve(inputDialog.value) : resolve(null);
  };

  return promise;
}

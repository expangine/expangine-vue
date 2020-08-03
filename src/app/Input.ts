
import { getPromiser } from './Promiser';
import { getMultipleDialoger } from './MultipleDialog';

export interface InputOptions
{
  title: string;
  message: string;
  value: string;
  label: string;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  matches: RegExp | false;
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
    matches: false,
    handle: () => { /* */ },
  };
}

export const inputDialog = getInputDefaults();

export const inputMultiplier = getMultipleDialoger(inputDialog);

export async function getInput(options: Partial<InputOptions> = {}): Promise<string | null> 
{
  const { resolve, promise } = getPromiser<string | null>();

  inputMultiplier.open(() =>
  {
    Object.assign(inputDialog, getInputDefaults());
    Object.assign(inputDialog, options);

    inputDialog.handle = (confirmed: boolean) => 
    {
      confirmed ? resolve(inputDialog.value) : resolve(null);

      inputMultiplier.close();
    };
  });

  return promise;
}

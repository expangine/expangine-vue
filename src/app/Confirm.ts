
import { getPromiser } from './Promiser';

export interface ConfirmOptions
{
  title: string;
  message: string;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  handle: (confirmed: boolean) => void;
}

export function getConfirmDefaults(): ConfirmOptions {
  return {
    title: 'Confirm',
    message: 'Are you sure?',
    confirm: 'Yes',
    unconfirm: 'No',
    visible: false,
    handle: () => { /* */ },
  };
}

export const confirmDialog = getConfirmDefaults();


export async function confirm(options: Partial<ConfirmOptions> = {}): Promise<boolean> 
{
  const { resolve, promise } = getPromiser<boolean>();

  Object.assign(confirmDialog, getConfirmDefaults());
  Object.assign(confirmDialog, options);

  confirmDialog.visible = true;
  confirmDialog.handle = (confirmed: boolean) => {
    confirmDialog.visible = false;
    resolve(confirmed);
  };

  return promise;
}

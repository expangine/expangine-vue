
import { getPromiser } from './Promiser';
import { PreferenceInput, Preferences } from './Preference';

export interface ConfirmOptions
{
  title: string;
  message: string;
  pref: false | PreferenceInput<boolean>;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  handle: (confirmed: boolean) => void;
}

export function getConfirmDefaults(): ConfirmOptions {
  return {
    title: 'Confirm',
    message: 'Are you sure?',
    pref: false,
    confirm: 'Yes',
    unconfirm: 'No',
    visible: false,
    handle: () => { /* */ },
  };
}

export const confirmDialog = getConfirmDefaults();


export async function getConfirmation(options: Partial<ConfirmOptions> = {}): Promise<boolean> 
{
  const { resolve, promise } = getPromiser<boolean>();

  Object.assign(confirmDialog, getConfirmDefaults());
  Object.assign(confirmDialog, options);

  if (confirmDialog.pref !== false) {
    if (Preferences.get(confirmDialog.pref, false)) {
      resolve(true);

      return promise;
    }
  }

  confirmDialog.visible = true;
  confirmDialog.handle = (confirmed: boolean) => {
    confirmDialog.visible = false;
    resolve(confirmed);
  };

  return promise;
}

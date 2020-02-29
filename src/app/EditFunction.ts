
import { Func } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_EDIT_FUNCTION = Preferences.define({
  key: 'fullscreen_edit_function',
  label: 'Edit function dialog is fullscreen when opened',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export interface EditFunctionOptions
{
  name: string;
  func: Func;
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: (save: boolean) => any;
}

export function getEditFunctionDefaults(): EditFunctionOptions
{
  return {
    name: '',
    func: null as unknown as Func,
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_EDIT_FUNCTION),
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const editFunctionDialog = getEditFunctionDefaults();

export const editFunctionMultiplier = getMultipleDialoger(editFunctionDialog);

export type EditFunctionResult = Func | false;


export async function getEditFunction(options: Partial<EditFunctionOptions> = {}): Promise<EditFunctionResult>
{
  const { resolve, promise } = getPromiser<EditFunctionResult>();

  editFunctionMultiplier.open(() =>
  {
    Object.assign(editFunctionDialog, getEditFunctionDefaults());
    Object.assign(editFunctionDialog, options);

    const { registry, name } = editFunctionDialog;

    editFunctionDialog.func = (name ? registry.defs.getFunction(name) : editFunctionDialog.func) || Func.create(registry.defs);
    editFunctionDialog.func.params.setParent();

    editFunctionDialog.close = (saved) => 
    {
      resolve(saved ? editFunctionDialog.func : false);

      editFunctionMultiplier.close();
    };
  });

  return promise;
}

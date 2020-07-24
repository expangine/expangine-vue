
import { Func, Entity } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_EDIT_METHOD = Preferences.define({
  key: 'fullscreen_edit_method',
  label: 'Edit method dialog is fullscreen when opened',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export interface EditMethodOptions
{
  name: string;
  entity: Entity;
  method: Func;
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: (save: boolean) => any;
}

export function getEditMethodDefaults(): EditMethodOptions
{
  return {
    name: '',
    entity: null as unknown as Entity,
    method: null as unknown as Func,
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_EDIT_METHOD),
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const editMethodDialog = getEditMethodDefaults();

export const editMethodMultiplier = getMultipleDialoger(editMethodDialog);

export type EditMethodResult = Func | false;


export async function getEditMethod(options: Partial<EditMethodOptions> = {}): Promise<EditMethodResult>
{
  const { resolve, promise } = getPromiser<EditMethodResult>();

  editMethodMultiplier.open(() =>
  {
    Object.assign(editMethodDialog, getEditMethodDefaults());
    Object.assign(editMethodDialog, options);

    const { registry, name, entity } = editMethodDialog;

    editMethodDialog.method = (name ? entity.methods[name] : editMethodDialog.method) || Func.create(registry.defs);
    editMethodDialog.method.params.setParent();

    editMethodDialog.close = (saved) => 
    {
      resolve(saved ? editMethodDialog.method : false);

      editMethodMultiplier.close();
    };
  });

  return promise;
}

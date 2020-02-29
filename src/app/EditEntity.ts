
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences, PreferenceCategory } from './Preference';
import { ObjectType, Entity, Types } from 'expangine-runtime';
import { TypeSettings } from '@/runtime/types/TypeVisuals';


export const PREF_FULLSCREEN_EDIT_ALIASED = Preferences.define({
  key: 'fullscreen_edit_aliased',
  label: 'Type editor dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});


export interface EditEntityOptions
{
  name: string;
  entity: Entity;
  type: ObjectType | null;
  settings: TypeSettings | null;
  registry: Registry;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  fullscreen: boolean;
  done: (saved: boolean) => void;
}

export function getEditEntityDefaults(): EditEntityOptions {
  return {
    name: '',
    entity: null as unknown as Entity,
    type: null,
    settings: null,
    registry: null as unknown as Registry,
    confirm: 'Close',
    unconfirm: 'Cancel',
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_EDIT_ALIASED),
    done: () => { /* */ },
  };
}

export const editEntityDialog = getEditEntityDefaults();

export const editEntityMultiplier = getMultipleDialoger(editEntityDialog);

export async function getEditEntity(options: Partial<EditEntityOptions> = {}): Promise<Entity | false> 
{
  const { resolve, promise } = getPromiser<Entity | false>();

  editEntityMultiplier.open(() => 
  {
    Object.assign(editEntityDialog, getEditEntityDefaults());
    Object.assign(editEntityDialog, options);

    const { name, registry } = editEntityDialog;

    if (name && !editEntityDialog.entity)
    {
      const entity = registry.defs.getEntity(name);

      if (entity)
      {
        editEntityDialog.entity = entity;
      }
    }

    if (!editEntityDialog.entity)
    {
      const type = editEntityDialog.type || Types.object();
      const meta = editEntityDialog.settings || registry.getTypeSettings(Types.list(type));

      editEntityDialog.entity = Entity.create(registry.defs, {
        name,
        type,
        meta,
      });
    }

    editEntityDialog.done = (saved) => 
    {
      resolve(saved ? editEntityDialog.entity : false);

      editEntityMultiplier.close();
    };
  });

  return promise;
}

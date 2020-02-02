
import Vue from 'vue';
import { TypeRelation, TypeStorage, ObjectType, objectEach } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { Registry } from '@/runtime/Registry';
import { renameType, addType } from './Aliased';


export interface EditAliasedOptions
{
  name: string;
  saveAs: string;
  registry: Registry;
  type: ObjectType;
  settings: TypeSettings<any>;
  storage: TypeStorage | null;
  relations: TypeRelation[];
  data: any[];
  confirm: string;
  confirmClose: string;
  unconfirm: string;
  visible: boolean;
  fullscreen: boolean;
  save: () => void;
  done: (save: boolean) => void;
}

export function getEditAliasedDefaults(): EditAliasedOptions {
  return {
    name: '',
    saveAs: '',
    registry: null as unknown as Registry,
    type: ObjectType.from(),
    settings: { input: '', defaultValue: null, options: null },
    data: [],
    storage: null,
    relations: [],
    confirm: 'Save',
    confirmClose: 'Save & Close',
    unconfirm: 'Cancel',
    visible: false,
    fullscreen: false,
    save: () => { /* */ },
    done: () => { /* */ },
  };
}

export const editAliasedDialog = getEditAliasedDefaults();

export async function getEditAliased(options: Partial<EditAliasedOptions> = {}): Promise<EditAliasedOptions | false> 
{
  const { resolve, promise } = getPromiser<EditAliasedOptions | false>();

  Object.assign(editAliasedDialog, getEditAliasedDefaults());
  Object.assign(editAliasedDialog, options);

  const { name, registry } = editAliasedDialog;
  const { defs } = registry;

  const foundType = name && name in defs.aliased
    ? defs.aliased[name]
    : editAliasedDialog.type;
  
  let saved = false;

  editAliasedDialog.type = foundType;
  editAliasedDialog.saveAs = name;
  editAliasedDialog.settings = name in registry.typeSettings
    ? registry.typeSettings[name]
    : registry.getTypeSettingsValidFor(foundType, editAliasedDialog.settings)
      ? editAliasedDialog.settings
      : registry.getTypeSettings(foundType);
  editAliasedDialog.storage = registry.defs.storage[name] || null;
  editAliasedDialog.data = name in registry.typeData
    ? registry.typeData[name]
    : [];
  editAliasedDialog.relations = registry.defs.getRelations(name);

  editAliasedDialog.visible = true;
  editAliasedDialog.save = () => 
  {
    const { name: savedAs, saveAs, storage, type } = editAliasedDialog;
    
    if (saveAs) 
    {
      if (savedAs !== saveAs && defs.aliased[savedAs]) 
      {
        Vue.delete(defs.aliased, savedAs);      
        Vue.delete(defs.storage, savedAs);
        Vue.delete(defs.parsers, savedAs);

        objectEach(defs.relations, (relation) =>
        {
          relation.rename(savedAs, saveAs);
        });

        renameType(registry, saveAs, savedAs);
      }
      else
      {
        addType(registry, saveAs);
      }

      Vue.set(defs.aliased, saveAs, type);
      Vue.set(defs.parsers, saveAs, () => type);

      editAliasedDialog.name = saveAs;

      if (storage)
      {
        Vue.set(defs.storage, saveAs, storage);
      }

      saved = true;
    }
  };

  editAliasedDialog.done = (save) =>
  {
    if (save)
    {
      editAliasedDialog.save();
    }

    editAliasedDialog.visible = false;

    saved ? resolve(editAliasedDialog) : resolve(false);
  };

  return promise;
}

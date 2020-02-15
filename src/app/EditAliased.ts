
import Vue from 'vue';
import { TypeRelation, TypeStorage, ObjectType, Traverser, objectEach, AliasedType, GetTypeExpression } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { Registry } from '@/runtime/Registry';
import { renameType, addType } from './Aliased';
import { getMultipleDialoger } from './MultipleDialog';
import { renameAliasedReferences } from './Refactor';
import { Preferences } from './Preference';


export const PREF_FULLSCREEN_EDIT_ALIASED = Preferences.define({
  key: 'fullscreen_edit_aliased',
  label: 'Type editor dialog is fullscreen when opened',
  defaultValue: false,
});


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
    fullscreen: Preferences.get(PREF_FULLSCREEN_EDIT_ALIASED),
    save: () => { /* */ },
    done: () => { /* */ },
  };
}

export const editAliasedDialog = getEditAliasedDefaults();

export const editAliasedMultiplier = getMultipleDialoger(editAliasedDialog);

export async function getEditAliased(options: Partial<EditAliasedOptions> = {}): Promise<EditAliasedOptions | false> 
{
  const { resolve, promise } = getPromiser<EditAliasedOptions | false>();

  editAliasedMultiplier.open(() => 
  {
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

    editAliasedDialog.save = () => 
    {
      const { name: savedAs, saveAs, storage, type } = editAliasedDialog;
      
      if (saveAs) 
      {
        const renamed = savedAs !== saveAs && defs.aliased[savedAs];

        if (renamed) 
        {
          Vue.delete(defs.aliased, savedAs);      
          Vue.delete(defs.storage, savedAs);
          Vue.delete(defs.parsers, savedAs);

          objectEach(defs.relations, (relation) =>
          {
            relation.rename(savedAs, saveAs);
          });

          renameType(registry, saveAs, savedAs);
          renameAliasedReferences(savedAs, saveAs);
        }

        Vue.set(defs.aliased, saveAs, type);
        Vue.set(defs.parsers, saveAs, () => type);

        editAliasedDialog.name = saveAs;

        if (storage)
        {
          Vue.set(defs.storage, saveAs, storage);
        }

        if (!renamed)
        {
          addType(registry, saveAs);
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

      saved ? resolve(editAliasedDialog) : resolve(false);

      editAliasedMultiplier.close();
    };
  });

  return promise;
}

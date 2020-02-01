
import Vue from 'vue';
import { TypeStorage, ObjectType, TypeIndex, TypeStoragePrimaryType, Type, Types } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';


export interface EditTypeIndexOptions
{
  name: string;
  index: TypeIndex;
  type: ObjectType;
  storage: TypeStorage | null;
  registry: Registry;
  propsOnly: boolean;
  propTypesAllowed: Type;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  handle: (confirm: boolean) => void;
}

export const editTypeIndexTypes = Types.not(
  Types.func(Types.any(), {}, (ex) => ex.noop()),
  Types.list(Types.any()),
  Types.map(Types.any(), Types.any()),
  Types.set(Types.any()),
  Types.object({'*': Types.any()}),
  Types.tuple(Types.any()),
);

export function getEditTypeIndexDefaults(): EditTypeIndexOptions {
  return {
    name: '',
    index: { name: '', props: [] },
    type: ObjectType.from(),
    storage: null,
    registry: null as unknown as Registry,
    propsOnly: false,
    propTypesAllowed: editTypeIndexTypes,
    confirm: 'Save',
    unconfirm: 'Cancel',
    visible: false,
    handle: () => { /* */ },
  };
}

export const editTypeIndexDialog = getEditTypeIndexDefaults();

export async function getEditTypeIndex(options: Partial<EditTypeIndexOptions> = {}): Promise<TypeIndex | false> 
{
  const { resolve, promise } = getPromiser<TypeIndex | false>();

  Object.assign(editTypeIndexDialog, getEditTypeIndexDefaults());
  Object.assign(editTypeIndexDialog, options);

  const { name, storage } = editTypeIndexDialog;

  // If a name is given and points to an index in storage, get that index.
  if (name && storage && name in storage.indexes)
  {
    editTypeIndexDialog.index = storage.indexes[name];
  }

  // If no name is given but a named index is given, copy it over.
  if (!name && editTypeIndexDialog.index.name)
  {
    editTypeIndexDialog.name = editTypeIndexDialog.index.name;
  }

  // If the index is a user defined primary key, only allow props to change.
  if (editTypeIndexDialog.index.primary && storage && storage.primaryType !== TypeStoragePrimaryType.GIVEN)
  {
    editTypeIndexDialog.propsOnly = true;
  }
  
  editTypeIndexDialog.visible = true;
  editTypeIndexDialog.handle = (cnofirm) => 
  {
    const { name: savedAs, index } = editTypeIndexDialog;
    
    if (cnofirm && index.name)
    {
      if (storage)
      {
        if (savedAs && savedAs !== index.name)
        {
          Vue.delete(storage.indexes, savedAs);
        }

        Vue.set(storage.indexes, index.name, index);
      }
      
      if (!index.unique)
      {
        delete index.unique;
      }

      if (!index.primary)
      {
        delete index.primary;
      }

      resolve(index);
    }
    else
    {
      resolve(false);
    }

    editTypeIndexDialog.visible = false;
  };

  return promise;
}

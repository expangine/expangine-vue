
import Vue from 'vue';
import { Entity, EntityIndex, EntityPrimaryType, Type, Types } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';


export interface EditEntityIndexOptions
{
  name: string;
  index: EntityIndex;
  entity: Entity;
  registry: Registry;
  propsOnly: boolean;
  propTypesAllowed: Type;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  handle: (confirm: boolean) => void;
}

export const editTypeIndexTypes = Types.not(
  Types.list(Types.any()),
  Types.map(Types.any(), Types.any()),
  Types.set(Types.any()),
  Types.object({'*': Types.any()}),
  Types.tuple(Types.any()),
);

export function getEditEntityIndexDefaults(): EditEntityIndexOptions {
  return {
    name: '',
    index: { name: '', props: [] },
    entity: null as unknown as Entity,
    registry: null as unknown as Registry,
    propsOnly: false,
    propTypesAllowed: editTypeIndexTypes,
    confirm: 'Close',
    unconfirm: 'Cancel',
    visible: false,
    handle: () => { /* */ },
  };
}

export const editTypeIndexDialog = getEditEntityIndexDefaults();

export const editTypeIndexMultiplier = getMultipleDialoger(editTypeIndexDialog);

export async function getEditEntityIndex(options: Partial<EditEntityIndexOptions> = {}): Promise<EntityIndex | false> 
{
  const { resolve, promise } = getPromiser<EntityIndex | false>();

  editTypeIndexMultiplier.open(() => 
  {
    Object.assign(editTypeIndexDialog, getEditEntityIndexDefaults());
    Object.assign(editTypeIndexDialog, options);

    const { name, entity } = editTypeIndexDialog;

    // If a name is given and points to an index in storage, get that index.
    if (name && entity && name in entity.indexes)
    {
      editTypeIndexDialog.index = entity.indexes[name];
    }

    // If no name is given but a named index is given, copy it over.
    if (!name && editTypeIndexDialog.index.name)
    {
      editTypeIndexDialog.name = editTypeIndexDialog.index.name;
    }

    // If the index is a user defined primary key, only allow props to change.
    if (editTypeIndexDialog.index.primary && entity && entity.primaryType !== EntityPrimaryType.GIVEN)
    {
      editTypeIndexDialog.propsOnly = true;
    }
    
    editTypeIndexDialog.handle = (saved) => 
    {
      resolve(saved ? editTypeIndexDialog.index : false);

      editTypeIndexMultiplier.close();
    };
  });

  return promise;
}

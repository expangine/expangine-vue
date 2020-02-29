
import { Relation, RelationKind, MapInput, Types, Definitions, EntityPropPair } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';



export interface EditRelationOptions
{
  name: string;
  relation: Relation | null;
  registry: Registry;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  done: (saved: boolean) => void;
}

export function getEditRelationDefaults(): EditRelationOptions {
  return {
    name: '',
    relation: null,
    registry: null as unknown as Registry,
    confirm: 'Close',
    unconfirm: 'Cancel',
    visible: false,
    done: () => { /* */ },
  };
}

export const editRelationDialog = getEditRelationDefaults();

export const editRelationMultiplier = getMultipleDialoger(editRelationDialog);

export async function getEditRelation(options: Partial<EditRelationOptions> = {}): Promise<Relation | false> 
{
  const { resolve, promise } = getPromiser<Relation | false>();

  editRelationMultiplier.open(() => 
  {
    Object.assign(editRelationDialog, getEditRelationDefaults());
    Object.assign(editRelationDialog, options);

    const { name, registry } = editRelationDialog;
    const relations = registry.defs.relations;

    // If a name is given and points to a relation, get that relation.
    if (name && !editRelationDialog.relation)
    {
      editRelationDialog.relation = relations.get(name);
    }

    // If no name is given but a named relation is given, copy it over.
    if (!name && editRelationDialog.relation)
    {
      editRelationDialog.name = editRelationDialog.relation.name;
    }

    editRelationDialog.done = (saved) => 
    {
      resolve(saved ? editRelationDialog.relation as Relation : false);

      editRelationMultiplier.close();
    };
  });

  return promise;
}

export const relationKindToText: Record<RelationKind, string> = {
  [RelationKind.HAS_MANY]: 'Has Many',
  [RelationKind.BELONGS_TO]: 'Belongs To (Has Many)',
  [RelationKind.HAS_ONE]: 'Has One',
  [RelationKind.ONE]: 'Belongs To (Has One)',
  [RelationKind.HAS_ONE_POLYMORPHIC]: 'Has One Polymorphic',
  [RelationKind.ONE_POLYMORPHIC]: 'Belongs To (Has One Polymorphic)',
};

export function getRelationKindText(kind: RelationKind)
{
  return relationKindToText[kind];
}

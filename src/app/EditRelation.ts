
import Vue from 'vue';
import { Relation, RelationKind, MapInput, Types, Type, TypePropPair, Definitions, objectFromProps } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';


export interface RelationData
{
  name: string;                   // hasMany hasOne
  one: string;                    // hasMany hasOne
  many: string;                   // hasMany
  oneRelationName: string;        // hasMany hasOne
  manyRelationName: string;       // hasMany
  foreignKeyPrefix: string;       // hasMany hasOne hasOnePolymorphic
  owns: boolean;                  // hasMany hasOne hasOnePolymorphic
  hasOne: string;                 // hasOne hasOnePolymorphic
  required: boolean;              // hasOne hasOnePolymorphic
  hasOneRelationName: string;     // hasOne hasOnePolymorphic
  morphs: TypePropPair;           // hasOnePolymorphic
  morphsToRelated: MapInput<any, string>; // hasOnePolymorphic
  poly: string[];                 // hasOnePolymorphic
  polyRelationName: string;       // hasOnePolymorphic
}

export interface EditRelationOptions
{
  name: string;
  typeName: string;
  kind: RelationKind | null;
  relation: Relation | null;
  relationData: RelationData;
  registry: Registry;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  handle: (confirm: boolean) => void;
}

export function getRelationDataDefaults(): RelationData
{
  return {
    name: '',
    one: '',
    many: '',
    oneRelationName: '',
    manyRelationName: '',
    foreignKeyPrefix: '',
    owns: false,
    hasOne: '',
    required: false,
    hasOneRelationName: '',
    morphs: ['discriminator', Types.text()],
    morphsToRelated: {},
    poly: [],
    polyRelationName: '',
  };
}

export function getEditRelationDefaults(): EditRelationOptions {
  return {
    name: '',
    typeName: '',
    kind: null,
    relation: null,
    relationData: getRelationDataDefaults(),
    registry: null as unknown as Registry,
    confirm: 'Save',
    unconfirm: 'Cancel',
    visible: false,
    handle: () => { /* */ },
  };
}

export const editRelationDialog = getEditRelationDefaults();

export async function getEditRelation(options: Partial<EditRelationOptions> = {}): Promise<Relation | false> 
{
  const { resolve, promise } = getPromiser<Relation | false>();

  Object.assign(editRelationDialog, getEditRelationDefaults());
  Object.assign(editRelationDialog, options);

  const { name, registry } = editRelationDialog;
  const relations = registry.defs.relations;

  // If a name is given and points to a relation, get that relation.
  if (name && !editRelationDialog.relation)
  {
    editRelationDialog.relation = relations[name];
  }

  // If no name is given but a named relation is given, copy it over.
  if (!name && editRelationDialog.relation)
  {
    editRelationDialog.name = editRelationDialog.relation.name;
  }

  // Set relation data if relation given.
  if (editRelationDialog.relation)
  {
    editRelationDialog.relationData = getRelationData(editRelationDialog.relation);
    editRelationDialog.kind = editRelationDialog.relation.kind;
  }
  else if (editRelationDialog.typeName)
  {
    editRelationDialog.relationData.one = 
    editRelationDialog.relationData.hasOne = editRelationDialog.typeName;
  }

  editRelationDialog.visible = true;
  editRelationDialog.handle = (confirm) => 
  {
    const { name: savedAs, relationData, kind } = editRelationDialog;
    
    if (confirm && kind !== null)
    {
      const relation = getRelationFromData(kind, registry.defs, relationData);

      if (!relation)
      {
        return resolve(false);
      }

      if (savedAs && savedAs !== relation.name)
      {
        Vue.delete(relations, savedAs);
      }

      Vue.set(relations, relation.name, relation);

      resolve(relation);
    }
    else
    {
      resolve(false);
    }

    editRelationDialog.visible = false;
  };

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

export function getRelationData(relation: Relation)
{
  const data = getRelationDataDefaults();

  switch (relation.kind)
  {
    case RelationKind.HAS_MANY:
      data.name = relation.name;
      data.one = relation.related[0].name;
      data.oneRelationName = relation.relatedRelationName;
      data.many = relation.subject.name;
      data.manyRelationName = relation.subjectRelationName;
      data.foreignKeyPrefix = relation.subjectRelationName + '_';
      data.owns = relation.owns;
      break;

    case RelationKind.HAS_ONE:
      data.name = relation.name;
      data.hasOne = relation.subject.name;
      data.hasOneRelationName = relation.subjectRelationName;
      data.one = relation.related[0].name;
      data.oneRelationName = relation.relatedRelationName;
      data.foreignKeyPrefix = relation.subjectRelationName + '_';
      data.required = relation.required;
      data.owns = relation.owns;
      break;

    case RelationKind.HAS_ONE_POLYMORPHIC:
      const map = Array.from(relation.morphsToRelated.entries());

      data.name = relation.name;
      data.hasOne = relation.subject.name;
      data.hasOneRelationName = relation.subjectRelationName;
      data.poly = relation.related.map((related) => related.name);
      data.polyRelationName = relation.relatedRelationName;
      data.morphs = relation.morphs as TypePropPair;
      data.morphsToRelated = map.reduce((obj, [prop, value]) => (obj[prop] = value, obj), {} as Record<string, any>);
      data.foreignKeyPrefix = relation.subjectRelationName + '_';
      data.required = relation.required;
      data.owns = relation.owns;
      break;
  }

  return data;
}

export function getRelationFromData(kind: RelationKind, defs: Definitions, data: RelationData)
{
  switch (kind)
  {
    case RelationKind.HAS_MANY:
      return Relation.hasMany(defs, data);
    case RelationKind.HAS_ONE:
      return Relation.hasOne(defs, data);
    case RelationKind.HAS_ONE_POLYMORPHIC:
      return Relation.hasOnePolymorphic(defs, data);
  }
}

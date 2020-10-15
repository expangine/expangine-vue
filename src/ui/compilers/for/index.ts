import { ListType, MapType, NoExpression, NullType, NumberType, ObjectType, objectValues, SetType, Type, Types } from 'expangine-runtime';
import { createFor, DIRECTIVE_FOR } from 'expangine-ui';
import { CompilerVisuals } from '../CompilerVisuals';
import ForEditor from './ForEditor.vue';
import ForViewer from './ForViewer.vue';


export const ForVisuals: CompilerVisuals = {
  name: DIRECTIVE_FOR,
  getPreviews: (registry) => [{
    name: 'For',
    description: 'Repeats components given a collection of items or a number of times',
    template: createFor(NoExpression.instance, []),
    preview: ['div', {}, {}, ['For']],
  }],
  label: () => DIRECTIVE_FOR,
  editor: ForEditor,
  viewer: ForViewer,
};

export const IndexType = Types.number(0, undefined, true);

export const CollectionItemType = Types.many(
  Types.list(Types.any()),
  Types.map(Types.any(), Types.any()),
  Types.set(Types.any()),
  Types.object({ [ObjectType.wilcardProperty]: Types.any() }),
  IndexType,
);

export const CollectionType = Types.list(CollectionItemType);

export function getCollectionTypes(c: Type): [Type, Type] | false
{
  if (c instanceof ListType)
  {
    return [IndexType, c.options.item];
  }
  else if (c instanceof MapType)
  {
    return [c.options.key, c.options.value];
  }
  else if (c instanceof SetType)
  {
    return [IndexType, c.options.value];
  }
  else if (c instanceof ObjectType)
  {
    const key = Types.enumForText(objectValues(c.options.props, (v, k) => [k, k] as [string, string]));
    const value = Types.mergeMany(objectValues(c.options.props), NullType.baseType);

    return [key, value];
  }
  else if (c instanceof NumberType)
  {
    return [IndexType, IndexType];
  }

  return false;
}

export function getCollectionTypeLabels(c: Type | null): [string, string]
{
  if (c instanceof ListType)
  {
    return ['Index', 'Item'];
  }
  else if (c instanceof MapType)
  {
    return ['Key', 'Value'];
  }
  else if (c instanceof SetType)
  {
    return ['Index', 'Value'];
  }
  else if (c instanceof ObjectType)
  {
    return ['Property', 'Value'];
  }
  else if (c instanceof NumberType)
  {
    return ['Index', 'Current'];
  }

  return ['Index', 'Item'];
}

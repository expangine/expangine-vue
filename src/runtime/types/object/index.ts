
import { ObjectType, MapType, TextType, ManyType, Type, TupleType, isString, objectValues, objectMap, AnyType, isObject } from 'expangine-runtime';
import { friendlyList, initializeSubs, obj, isExactType } from '@/common';
import { Preferences, PreferenceCategory } from '@/app/Preference';
import { getConfirmation } from '@/app/Confirm';
import { createVisuals, TypeSettings, TypeSubNode } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { ObjectFormInput } from './ObjectFormTypes';
import ObjectEditor from './ObjectEditor.vue';


const PREF_OBJECT_MODIFIER = Preferences.define({
  key: 'object_modifier',
  label: 'Convert to Object without confirmation',
  category: [PreferenceCategory.DESIGN, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export const ObjectVisuals = createVisuals<string>()({
  type: ObjectType,
  name: 'Object',
  description: 'An object is a collection of named fields.',
  describe: () => 'Object',
  describeLong: (registry, type, padding, tab, newline) => 
    'Object {' + newline +
    objectValues(type.options.props, (propType, prop) => 
      propType
        ? padding + tab + prop + ': ' + registry.getTypeDescribeLong(propType, tab, newline, padding + tab) + newline
        : '',
    ).join('') +
    padding + '}'
  ,
  stringify: ({ registry, type, value }) => {
    const props: Array<[string, string]> = [];

    for (const prop in type.options.props) {
      const propType = type.options.props[prop];
      const propQuote = !prop.match(/^[$\w]+$/);

      if (value[prop] === undefined) {
        continue;
      }

      props.push([
        propQuote ? JSON.stringify(prop) : prop,
        registry.getTypeStringify(propType, value[prop]),
      ]);
    }
    
    return '{' + props.map(([p, v]) => p + ':' + v).join(',') + '}';
  },
  toString: ({ registry, value, type, tab, newline, padding, process, processInvalid }) => {
    if (!isObject(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    let out = '{' + newline;

    for (const prop in value)
    {
      const propValue = value[prop];

      if (propValue === undefined) {
        continue;
      }

      const propValueType = type.options.props[prop] || AnyType.baseType;
      const propValueString = registry.getTypeToString(propValue, propValueType, tab, newline, padding + tab, process, processInvalid);

      if (propValueString === 'undefined') {
        continue;
      }

      out += padding + tab;
      out += prop;
      out += ': ';
      out += propValueString;
      out += newline;
    }

    out += padding + '}';

    return out;
  },
  subNodes: ({ value, type }) => {
    const nodes: TypeSubNode[] = [];
    for (const prop in value) {
      nodes.push({
        sub: prop,
        subType: TextType.baseType,
        value: value[prop],
        valueType: type.options.props[prop],
      });
    }
    return nodes;
  },
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = isString(key)
      ? key
      : '[ property ]';
    const description = isString(key)
      ? registry.getTypeDescribeLong(value, '', '  ')
      : key instanceof TextType
        ? 'A text value for a given property'
        : 'An enum value for a given property';

    return { key, value, text, description };
  }),
  subSettings: (registry, type, settings, sub, forKey) => {
    return isString(sub.key) && settings.sub
      ? settings.sub[sub.key]
      : null;
  },
  settingsFor: ({ registry, type, sub }) => {
    const subs = objectMap(type.options.props, (t, prop) => registry.getTypeSettings(t, prop));
  
    return {
      input: 'form',
      defaultValue: objectMap(subs, (s) => s.defaultValue),
      options: { 
        ...ObjectFormInput.getDefaultOptions(), 
        label: sub + '', 
        columns: objectValues(subs, (_, prop) => ({ prop, cols: 12 })),
      },
      sub: subs,
    };
  },
  editor: ObjectEditor,
  allowsDefault: false,
  defaultInput: 'form',
  inputsOrder: ['form'],
  inputs: {
    form: ObjectFormInput,
  },
});

export const ObjectBuilder: TypeBuilder = 
{
  getOption: ({ registry, existingType, existingSettings }) => ({
    text: 'Object',
    description: 'An entity with defined property names and types',
    priority: 3,
    value: async () => (initializeSubs(registry, {
      type: new ObjectType({ props: existingType ? obj({ value: existingType }) : obj() }),
      settings: { 
        input: 'form', 
        defaultValue: obj(),
        options: ObjectFormInput.getDefaultOptions(), 
        sub: existingType ? obj({ value: existingSettings }) : obj(),
      },
    })),
  }),
};

export const ObjectModifierToObject: TypeModifier<ObjectType> =
{
  getOption: (input) => {
    const { registry } = input;
    let { type, typeSettings } = input;

    if (isExactType(type, ObjectType))
    {
      return false;
    }

    if (type instanceof MapType)
    {
      if (!(type.options.key instanceof TextType))
      {
        return false;
      }

      type = type.options.value;
      typeSettings = (typeSettings as TypeSettings<any, string>).sub.value;
    }

    const props: Type[] = type instanceof ManyType || type instanceof TupleType
      ? type.options
      : [type];
    const settings: TypeSettings[] = type instanceof ManyType || type instanceof TupleType
      ? (typeSettings as TypeSettings<any, number>).sub
      : [typeSettings];

    const names = props.map((p) => registry.getTypeVisuals(p).name);

    return {
      text: 'Convert to Object',
      description: names.length ? friendlyList(names) : 'An empty object',
      priority: 15,
      value: async () => {
        if (!await getConfirmation({ pref: PREF_OBJECT_MODIFIER })) {
          return false;
        }

        const propMap = obj();
        const propSettings = obj();

        for (let i = 0; i < props.length; i++) {
          propMap[i] = props[i];
          propSettings[i] = settings[i];
        }

        return initializeSubs(registry, {
          type: new ObjectType({ props: propMap }),
          settings: { 
            input: 'form', 
            defaultValue: obj(),
            options: ObjectFormInput.getDefaultOptions(), 
            sub: propSettings,
          },
        });        
      },
    };
  },
};

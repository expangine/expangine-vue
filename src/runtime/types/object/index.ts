
import { ObjectType, MapType, TextType, ManyType, Type, TupleType, ObjectOps, ExpressionBuilder, isString } from 'expangine-runtime';
import { friendlyList, initializeSubs, obj } from '@/common';
import { createVisuals, TypeSettings } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { getConfirmation } from '@/app/Confirm';
import { ObjectFormInput } from './ObjectFormTypes';
import ObjectEditor from './ObjectEditor.vue';


const ex = new ExpressionBuilder();

export const ObjectVisuals = createVisuals({
  type: ObjectType,
  name: 'Object',
  description: 'An object is a collection of named fields.',
  describe: () => 'Object',
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = isString(key)
      ? key
      : '[ property ]';
    const description = isString(key)
      ? registry.getTypeDescribe(value)
      : 'A value for a given property';

    return { key, value, text, description };
  }),
  exprs: {
    create: () => ex.op(ObjectOps.create, {}),
    valid: () => ex.op(ObjectOps.isValid, {value: ex.get('value')}),
    compare: () => ex.op(ObjectOps.cmp, {value: ex.get('value'), test: ex.get('test')}),
  },
  editor: ObjectEditor,
  allowsDefault: false,
  defaultInput: 'form',
  inputsOrder: ['form'],
  inputs: {
    form: ObjectFormInput,
  },
});

export const ObjectBuilder: TypeBuilder<ObjectType> = 
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

    if (type instanceof ObjectType)
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
      description: friendlyList(names),
      priority: 15,
      value: async () => {
        if (!await getConfirmation()) {
          return false;
        }

        const propMap = obj();
        const propSettings = obj();

        for (let i = 0; i < props.length; i++) {
          propMap[i] = props[i];
          propSettings[i] = settings[i];
        }

        return initializeSubs(registry, {
          kind: 'change',
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

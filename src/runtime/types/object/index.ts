
import { ObjectType, MapType, TextType, ManyType, Type, TupleType } from 'expangine-runtime';
import { friendlyList } from '@/common';
import { createVisuals, TypeSettings } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { TypeModifier } from '@/runtime/TypeModifier';
import { ObjectFormInput } from './ObjectFormTypes';
import ObjectEditor from './ObjectEditor.vue';
import { confirm } from '@/app/Confirm';


export const ObjectVisuals = createVisuals({
  type: ObjectType,
  name: 'Object',
  description: 'An object is a collection of named fields.',
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
  getOption: () => ({
    text: 'Object',
    description: 'An entity with defined property names and types',
    priority: 3,
    value: async () => ({
      type: new ObjectType({ props: Object.create(null) }),
      settings: { 
        input: 'form', 
        defaultValue: Object.create(null),
        options: ObjectFormInput.getDefaultOptions(), 
        sub: Object.create(null),
      },
    }),
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

    const names = props.map((p) => registry.getVisuals(p).name);

    return {
      text: 'Convert to Object',
      description: friendlyList(names),
      priority: 15,
      value: async () => {
        if (!await confirm()) {
          return false;
        }

        const propMap = Object.create(null);
        const propSettings = Object.create(null);

        for (let i = 0; i < props.length; i++) {
          propMap[i] = props[i];
          propSettings[i] = settings[i];
        }

        return {
          kind: 'change',
          type: new ObjectType({ props: propMap }),
          settings: { 
            input: 'form', 
            defaultValue: Object.create(null),
            options: ObjectFormInput.getDefaultOptions(), 
            sub: propSettings,
          },
        };        
      },
    };
  },
};

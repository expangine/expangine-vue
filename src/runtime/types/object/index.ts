
import { ObjectType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { ObjectFormInput } from './ObjectFormTypes';
import ObjectEditor from './ObjectEditor.vue';


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


import { ObjectType, AnyType } from 'expangine-runtime';
import { TypeVisuals, TypeSettings } from '@/runtime/TypeVisuals';
import { ObjectFormInputs } from './ObjectFormTypes';
import ObjectEditor from './ObjectEditor.vue';


const ObjectVisuals: TypeVisuals<ObjectType, true, false> = 
{
  type: ObjectType,
  newInstance: () => new ObjectType({ props: {} }),
  name: 'Object',
  description: 'An object is a collection of named fields.',
  editor: ObjectEditor,
  allowsDefault: false,
  buildable: true,
  buildLabel: 'Object',
  onBuild: (parent, parentSettings) => ({
    type: new ObjectType({ props: {} }),
    settings: { 
      input: 'form', 
      defaultValue: Object.create(null),
      options: ObjectFormInputs.getDefaultOptions(), 
      sub: Object.create(null),
    },
  }),
  defaultInput: 'form',
  inputsOrder: ['form'],
  inputs: {
    form: ObjectFormInputs,
  },
};

export default ObjectVisuals;

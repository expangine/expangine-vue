
import { AnyType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { AnyInput } from './AnyTypes';
import AnyEditor from './AnyEditor.vue';
import { TypeBuilder } from '../TypeBuilder';



export const AnyVisuals = createVisuals()({
  type: AnyType,
  name: 'Any',
  description: 'Any value',
  describe: ({registry, type}) => 'Any value',
  describeLong: (registry, type, padding) => 'Any',
  toString: ({ value, type, process, processInvalid }) => {
    return process(value, type);
  },
  subNodes: () => [],
  subOptions: (registry, type) => [],
  subSettings: (registry, type, settings, sub) => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'any', 
    defaultValue: '', 
    options: { 
      ...AnyInput.getDefaultOptions(), 
      ...registry.settingsOverrides, 
      label: sub,
    },
  }),
  editor: AnyEditor,
  defaultInput: 'any',
  inputsOrder: ['any'],
  inputs: {
    any: AnyInput,
  },
});


export const AnyBuilder: TypeBuilder =
{
  getOption: () => ({
    text: 'Any',
    description: 'A value that can be anything, defined by the user',
    priority: 15,
    value: async () => ({
      type: new AnyType({ }), 
      settings: { 
        input: 'any', 
        defaultValue: '',
        options: AnyInput.getDefaultOptions(), 
      },
    }),
  }),
};

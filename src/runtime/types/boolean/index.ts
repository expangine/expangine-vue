
import { BooleanType, isString, isBoolean } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { BooleanCheckboxInput } from './BooleanCheckboxTypes';
import { BooleanSwitchInput } from './BooleanSwitchTypes';
import { BooleanRadioInput } from './BooleanRadioTypes';
import { BooleanSelectInput } from './BooleanSelectTypes';
import BooleanEditor from './BooleanEditor.vue';
import BooleanOptions from './BooleanOptions.vue';



export const BooleanVisuals = createVisuals()({
  type: BooleanType,
  name: 'Boolean',
  description: 'A boolean value is true/false, on/off, yes/no, etc.',
  describe: () => 'Boolean',
  describeLong: (registry, type, padding) => 'Boolean',
  stringify: ({ value }) => value ? 'true' : 'false',
  toString: ({ value, type, process, processInvalid }) => {
    if (!isBoolean(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }
    
    return value ? 'true' : 'false';
  },
  subNodes: () => [],
  subOptions: () => [],
  subSettings: () => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'checkbox', 
    defaultValue: false, 
    options: { ...BooleanCheckboxInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub + '' },
  }),
  editor: BooleanEditor,
  options: BooleanOptions,
  defaultInput: 'checkbox',
  inputsOrder: ['checkbox', 'switch', 'radio', 'select'],
  inputs: {
    checkbox: BooleanCheckboxInput,
    switch: BooleanSwitchInput,
    radio: BooleanRadioInput,
    select: BooleanSelectInput,
  },
});

export const BooleanBuilder: TypeBuilder =
{
  getOption: () => ({
    text: 'Boolean',
    description: 'A true/false value',
    priority: 5,
    value: async () => ({
      type: new BooleanType({ }), 
      settings: { 
        input: 'checkbox', 
        defaultValue: false,
        options: BooleanCheckboxInput.getDefaultOptions(), 
      },
    }),
  }),
};

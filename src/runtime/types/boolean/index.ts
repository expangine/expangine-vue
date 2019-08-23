
import { BooleanType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { BooleanCheckboxInput } from './BooleanCheckboxTypes';
import { BooleanSwitchInput } from './BooleanSwitchTypes';
import { BooleanRadioInput } from './BooleanRadioTypes';
import { BooleanSelectInput } from './BooleanSelectTypes';
import BooleanEditor from './BooleanEditor.vue';


const BooleanVisuals: TypeVisuals<BooleanType, true, false> = 
{
  type: BooleanType,
  newInstance: () => new BooleanType({}),
  name: 'Boolean',
  description: 'A boolean value is true/false, on/off, yes/no, etc.',
  editor: BooleanEditor,
  buildable: true,
  buildLabel: 'Boolean',
  onBuild: async () => ({
    type: new BooleanType({ }), 
    settings: { 
      input: 'checkbox', 
      defaultValue: false,
      options: BooleanCheckboxInput.getDefaultOptions(), 
    },
  }),
  defaultInput: 'checkbox',
  inputsOrder: ['checkbox', 'switch', 'radio', 'select'],
  inputs: {
    checkbox: BooleanCheckboxInput,
    switch: BooleanSwitchInput,
    radio: BooleanRadioInput,
    select: BooleanSelectInput,
  },
};

export default BooleanVisuals;

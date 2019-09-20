
import { BooleanType, OperationExpression, BooleanOps, GetExpression, ExpressionBuilder } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { BooleanCheckboxInput } from './BooleanCheckboxTypes';
import { BooleanSwitchInput } from './BooleanSwitchTypes';
import { BooleanRadioInput } from './BooleanRadioTypes';
import { BooleanSelectInput } from './BooleanSelectTypes';
import BooleanEditor from './BooleanEditor.vue';
import BooleanOptions from './BooleanOptions.vue';


const ex = new ExpressionBuilder();

export const BooleanVisuals = createVisuals({
  type: BooleanType,
  name: 'Boolean',
  description: 'A boolean value is true/false, on/off, yes/no, etc.',
  create: () => ex.op(BooleanOps.create, {}),
  isValid: () => ex.op(BooleanOps.isValid, {value: ex.get('value')}),
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

export const BooleanBuilder: TypeBuilder<BooleanType> =
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

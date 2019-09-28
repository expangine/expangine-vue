
import { BooleanType, OperationExpression, BooleanOps, GetExpression, ExpressionBuilder } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
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
  describe: () => 'Boolean',
  subOptions: () => [],
  exprs: {
    create: () => ex.op(BooleanOps.create, {}),
    valid: () => ex.op(BooleanOps.isValid, {value: ex.get('value')}),
    compare: () => ex.op(BooleanOps.cmp, {value: ex.get('value'), test: ex.get('test')}),
  },
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

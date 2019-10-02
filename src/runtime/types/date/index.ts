
import { DateType, ExpressionBuilder, DateOps } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { DatePickerInput } from './DatePickerTypes';
import { DateTextBoxInput } from './DateTextBoxTypes';
import DateEditor from './DateEditor.vue';
import DateOptions from './DateOptions.vue';


const ex = new ExpressionBuilder();

export const DateVisuals = createVisuals(
{
  type: DateType,
  name: 'Date',
  description: 'A date value',
  describe: () => 'Date',
  subOptions: () => [],
  subSettings: () => null,
  exprs: {
    create: () => ex.op(DateOps.create, {}),
    valid: () => ex.op(DateOps.isValid, {value: ex.get('value')}),
    compare: () => ex.op(DateOps.cmp, {value: ex.get('value'), test: ex.get('test')}),
  },
  editor: DateEditor,
  options: DateOptions,
  defaultInput: 'picker',
  inputsOrder: ['picker', 'textbox'],
  inputs: {
    picker: DatePickerInput,
    textbox: DateTextBoxInput,
  },
});

export const DateBuilder: TypeBuilder<DateType> =
{
  getOption: () => ({
    text: 'Date',
    description: 'A date value, optionally includes time',
    priority: 6,
    value: async () => ({
      type: new DateType({ }), 
      settings: { 
        input: 'picker', 
        defaultValue: new Date(),
        options: DatePickerInput.getDefaultOptions(), 
      },
    }),
  }),
};

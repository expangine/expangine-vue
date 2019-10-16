
import { DateType, ExpressionBuilder, DateOps, isString } from 'expangine-runtime';
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
  describeLong: (registry, type, padding) => 'Date',
  toString: ({ value, type, process }) => {
    const processed = process(value, type);

    return isString(processed) 
      ? processed
      : type.options.withTime
        ? (value.getMonth() + 1) + '/' + value.getDate() + '/' + value.getFullYear() + ' ' + value.getHours() + 'h' + value.getMinutes() + 'm'
        : (value.getMonth() + 1) + '/' + value.getDate() + '/' + value.getFullYear();
  },
  subOptions: () => [],
  subSettings: () => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'picker', 
    defaultValue: new Date().toISOString(), 
    options: { ...DatePickerInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub },
  }),
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

export const DateBuilder: TypeBuilder =
{
  getOption: () => ({
    text: 'Date',
    description: 'A date value, optionally includes time',
    priority: 6,
    value: async () => ({
      kind: 'build',
      type: new DateType({ }), 
      settings: { 
        input: 'picker', 
        defaultValue: new Date(),
        options: DatePickerInput.getDefaultOptions(), 
      },
    }),
  }),
};

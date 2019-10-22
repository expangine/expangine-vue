
import { DateType, ExpressionBuilder, isString, isDate } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { DatePickerInput } from './DatePickerTypes';
import { DateTextBoxInput } from './DateTextBoxTypes';
import DateEditor from './DateEditor.vue';
import DateOptions from './DateOptions.vue';


export const DateVisuals = createVisuals()(
{
  type: DateType,
  name: 'Date',
  description: 'A date value',
  describe: () => 'Date',
  describeLong: (registry, type, padding) => 'Date',
  toString: ({ value, type, process, processInvalid }) => {
    if (!isDate(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }
    
    return type.options.withTime
      ? (value.getMonth() + 1) + '/' + value.getDate() + '/' + value.getFullYear() + ' ' + value.getHours() + 'h' + value.getMinutes() + 'm'
      : (value.getMonth() + 1) + '/' + value.getDate() + '/' + value.getFullYear();
  },
  subNodes: () => [],
  subOptions: () => [],
  subSettings: () => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'picker', 
    defaultValue: new Date().toISOString(), 
    options: { ...DatePickerInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub },
  }),
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
      type: new DateType({ }), 
      settings: { 
        input: 'picker', 
        defaultValue: new Date(),
        options: DatePickerInput.getDefaultOptions(), 
      },
    }),
  }),
};

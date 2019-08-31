
import { DateType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { DatePickerInput } from './DatePickerTypes';
import { DateTextBoxInput } from './DateTextBoxTypes';
import DateEditor from './DateEditor.vue';


export const DateVisuals = createVisuals(
{
  type: DateType,
  name: 'Date',
  description: 'A date value',
  editor: DateEditor,
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

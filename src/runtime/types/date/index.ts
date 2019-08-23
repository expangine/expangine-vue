
import { DateType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { PickerInput } from './PickerTypes';
import { TextBoxInput } from './TextBoxTypes';
import DateEditor from './DateEditor.vue';


const DateVisuals: TypeVisuals<DateType, true, false> = 
{
  type: DateType,
  newInstance: () => new DateType({}),
  name: 'Date',
  description: 'A date value',
  editor: DateEditor,
  buildable: true,
  buildLabel: 'Date',
  onBuild: async () => ({
    type: new DateType({ }), 
    settings: { 
      input: 'picker', 
      defaultValue: new Date(),
      options: PickerInput.getDefaultOptions(), 
    },
  }),
  defaultInput: 'picker',
  inputsOrder: ['picker', 'textbox'],
  inputs: {
    picker: PickerInput,
    textbox: TextBoxInput,
  },
};

export default DateVisuals;

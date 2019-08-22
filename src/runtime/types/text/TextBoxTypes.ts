
import { TextType } from 'expangine-runtime';
import TextBox from './TextBox.vue';
import TextBoxSettings from './TextBoxSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface TextBoxOptions
{
  label: string;
  hint: string;
  prefix: string;
  suffix: string;
  autocomplete: string;
  counter: boolean;
  clearable: boolean;
  dark: boolean;
  filled: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
  type: string;
}

export const TextBoxInput: TypeVisualInput<TextType, TextBoxOptions> = 
{
  name: 'Textbox',
  description: 'A textbox allows single-line plain textual input',
  input: TextBox,
  settings: TextBoxSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    prefix: '',
    suffix: '',
    autocomplete: 'new-password',
    counter: false,
    clearable: false,
    dark: false,
    filled: false,
    outlined: false,
    dense: false,
    flat: false,
    type: 'text',
  }),
  getSummary: (options: TextBoxOptions) => (
    `<strong>Textbox</strong>: ${options.label}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
};

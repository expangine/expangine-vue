
import { TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import TextArea from './TextArea.vue';
import TextAreaSettings from './TextAreaSettings.vue';


export interface TextAreaOptions
{
  label?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  rows?: number;
  rowHeight?: number;
  autocomplete?: string;
  autoGrow?: boolean;
  counter?: boolean;
  clearable?: boolean;
  dark?: boolean;
  filled?: boolean;
  solo?: boolean;
  outlined?: boolean;
  dense?: boolean;
  flat?: boolean;
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  clearIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const TextAreaInput: TypeVisualInput<TextType, TextAreaOptions> = 
{
  name: 'Textarea',
  description: 'A textarea allows multi-line plain textual input',
  input: TextArea,
  settings: TextAreaSettings,
  getComplexity: () => 0,
  isVisible: () => true,
  getDefaultOptions: () => ({
    autocomplete: 'new-password',
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Textarea</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
};

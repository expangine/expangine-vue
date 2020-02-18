
import { TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import TextHtml from './TextHtml.vue';
import TextHtmlSettings from './TextHtmlSettings.vue';


export interface TextHtmlOptions
{
  label?: string;
  placeholder?: string;
  hideModules: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    justifyLeft?: boolean;
    justifyCenter?: boolean;
    justifyRight?: boolean;
    headings?: boolean;
    link?: boolean;
    code?: boolean;
    orderedList?: boolean;
    unorderedList?: boolean;
    image?: boolean;
    table?: boolean;
    removeFormat?: boolean;
  };
  maxHeight?: string | number;
  forcePlainTextOnPaste?: boolean;
}

export const TextHtmlInput: TypeVisualInput<TextType, TextHtmlOptions> = 
{
  name: 'Rich Text',
  description: 'An input that allows simple formatting',
  input: TextHtml,
  settings: TextHtmlSettings,
  getComplexity: () => 0,
  isVisible: () => true,
  getDefaultOptions: () => ({
    hideModules: {},
  }),
  getName: (options) => options.label || options.placeholder,
  getSummary: (options) => (
    `<strong>Rich Text</strong>: ${options.label || options.placeholder || ''}`
  ),
};

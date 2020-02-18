
import { TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import TextMarkdown from './TextMarkdown.vue';
import TextMarkdownSettings from './TextMarkdownSettings.vue';


export interface TextMarkdownOptions
{
  label?: string;
  placeholder?: string;
  hint?: string;
  html?: boolean;
  linkify?: boolean;
  emoji?: boolean;
  typographer?: boolean;
}

export const TextMarkdownInput: TypeVisualInput<TextType, TextMarkdownOptions> = 
{
  name: 'Markdown',
  description: 'An input for Markdown',
  input: TextMarkdown,
  settings: TextMarkdownSettings,
  getComplexity: () => 0,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Markdown</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
};

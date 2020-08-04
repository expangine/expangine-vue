
import { EntityType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import EntityAutocmplete from './EntityAutocomplete.vue';
import EntityAutocompleteSettings from './EntityAutocompleteSettings.vue';


export interface EntityAutocompleteOptions
{
  label?: string;
  hint?: string;
  dark?: boolean;
  filled?: boolean;
  outlined?: boolean;
  dense?: boolean;
  solo?: boolean;
  flat?: boolean;
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  clearIcon?: string;
  backgroundColor?: string;
  color?: string;
  itemColor?: string;
}

export const EntityAutocompleteInput: TypeVisualInput<EntityType, EntityAutocompleteOptions> = 
{
  name: 'Autocomplete',
  description: 'An autocomplete where the option text is the entity description and the value is the entity.',
  input: EntityAutocmplete,
  settings: EntityAutocompleteSettings,
  getComplexity: () => 1,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Autocomplete</strong>: ${options.label || options.hint || ''}`
  ),
};

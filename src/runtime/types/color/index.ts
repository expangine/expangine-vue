
import { ColorType, TextType, isString, COMPONENT_MAX, ColorSpaceRGB, isColor } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { ColorPickerInput } from './ColorPickerTypes';
import ColorEditor from './ColorEditor.vue';
import ColorOptions from './ColorOptions.vue';


export const ColorVisuals = createVisuals()(
{
  type: ColorType,
  name: 'Color',
  description: 'A color value',
  describe: () => 'Color',
  describeLong: (registry, type, padding) => 'Color',
  toString: ({ value, type, process, processInvalid }) => {
    if (!isColor(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    return ColorSpaceRGB.formatMap.bestfit.formatter(value);
  },
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = isString(key)
      ? key
      : '[ component ]';
    const description = isString(key)
      ? registry.getTypeDescribeLong(value, '', '  ')
      : key instanceof TextType
        ? 'A text value for a given component'
        : 'An enum value for a given component';

    return { key, value, text, description };
  }),
  subSettings: () => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'picker', 
    defaultValue: { r: COMPONENT_MAX, g: COMPONENT_MAX, b: COMPONENT_MAX, a: COMPONENT_MAX }, 
    options: { ...ColorPickerInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub },
  }),
  editor: ColorEditor,
  options: ColorOptions,
  defaultInput: 'picker',
  inputsOrder: ['picker'],
  inputs: {
    picker: ColorPickerInput,
  },
});

export const ColorBuilder: TypeBuilder =
{
  getOption: () => ({
    text: 'Color',
    description: 'A color value, optionally includes alpha',
    priority: 6,
    value: async () => ({
      type: new ColorType({ }), 
      settings: { 
        input: 'picker', 
        defaultValue: { r: COMPONENT_MAX, g: COMPONENT_MAX, b: COMPONENT_MAX, a: COMPONENT_MAX },
        options: ColorPickerInput.getDefaultOptions(), 
      },
    }),
  }),
};

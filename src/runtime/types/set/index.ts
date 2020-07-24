
import { SetType, TextType, isString, ObjectType, objectReduce, NumberType, isSet, ListType, Exprs, NullType, MapType, Types } from 'expangine-runtime';
import { createVisuals, TypeSettings, TypeUpdateEvent } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TextBoxInput } from '../text/TextBoxTypes';
import { SetListInput } from './SetListTypes';
import { SetComboInput } from './SetComboTypes';
import { SetEnumSelectInput } from './SetEnumSelectTypes';
import { SetEnumAutocompleteInput } from './SetEnumAutocompleteTypes';
import { SetEnumCheckboxInput } from './SetEnumCheckboxTypes';
import { initializeSubs } from '@/common';
import { SetSubs } from './SetTypes';
import { TypeModifier } from '../TypeModifier';
import { getConfirmation } from '@/app/Confirm';
import { getProgram } from '@/app/GetProgram';
import { Preferences, PreferenceCategory } from '@/app/Preference';
import SetEditor from './SetEditor.vue';
import SetOptions from './SetOptions.vue';


const PREF_SET_MODIFIER = Preferences.define({
  key: 'set_modifier',
  label: 'Convert to Set without confirmation',
  category: [PreferenceCategory.DESIGN, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export const SetVisuals = createVisuals<SetSubs>()({
  type: SetType,
  name: () => 'Set',
  description: 'A unique collection of values.',
  describe: ({registry, type}) => 'Set of ' + registry.getTypeDescribe(type.options.value),
  describeLong: (registry, type, padding, tab, newline) => 
    'Set of ' + registry.getTypeDescribeLong(type.options.value, tab, newline, padding)
  ,
  stringify: ({ registry, type, value }) => '[' + value.map((v: any) => registry.getTypeStringify(type.options.value, v)).join(',') + ']',
  toString: ({ registry, value, type, tab, newline, padding, process, processInvalid }) => {
    if (!isSet(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    return '{' + newline + 
      Array.from(value).map((item: any) => padding + tab + registry.getTypeToString(item, type.options.value, tab, newline, padding + tab, process, processInvalid) + newline).join('') + 
      padding + '}';
  },
  subNodes: ({ registry, type, value }) => Array.from(value).map((item: any, index: any) => ({
    sub: index,
    subType: NumberType.baseType,
    value: item,
    valueType: type.options.value,
  })),
  subOptions: () => [],
  subSettings: () => null,
  settingsFor: ({ registry, type, sub }) => {
    const value = type.options.value;
    const settings = registry.getTypeSettings(value, sub);

    if (value instanceof ObjectType) { 
      const objectSettings = settings as TypeSettings<any, string>;
      const complexity = objectReduce(objectSettings.sub, (propSetting, prop, max) => 
        Math.max(max, registry.getTypeVisualInputComplexity(value.options.props[prop], propSetting))
      , 0);

      return {
        input: 'list',
        defaultValue: [],
        options: { 
          ...SetListInput.getDefaultOptions(), 
          ...registry.settingsOverrides,
          title: sub + '', 
          itemName: sub + '',
          paging: true,
          pagination: {
            totalVisible: 10,
          },
          pageSize: complexity === 1 ? 5 : 1,
        },
        sub: {
          value: settings,
        },
      };
    }

    return {
      input: 'list', 
      defaultValue: [],
      options: { 
        ...SetListInput.getDefaultOptions(), 
        ...registry.settingsOverrides, 
        title: sub + '',
        itemName: sub + '',
      }, 
      sub: { 
        value: settings, 
      },
    };
  },
  editor: SetEditor,
  options: SetOptions,
  defaultInput: 'list',
  inputsOrder: ['list', 'combo', 'select', 'autocomplete', 'checkbox'],
  inputs: {
    list: SetListInput,
    combo: SetComboInput,
    select: SetEnumSelectInput,
    autocomplete: SetEnumAutocompleteInput,
    checkbox: SetEnumCheckboxInput,
  },
});

export const SetBuilder: TypeBuilder = 
{
  getOption: ({ registry, existingType, existingSettings }) => ({
    text: 'Set',
    description: 'A unique collection of values',
    priority: 9,
    value: async () => (initializeSubs(registry, {
      type: SetType.forItem(existingType || new TextType({ })),
      settings: {
        input: 'list',
        defaultValue: [],
        options: SetListInput.getDefaultOptions(),
        sub: { 
          value: existingSettings || { 
            input: 'textbox', 
            defaultValue: '',
            options: TextBoxInput.getDefaultOptions(), 
          },
        },
      },
    })),
  }),
};

export const SetBuilderWrapper: TypeBuilderWrapper =
{
  getOption: ({ registry }) => ({
    text: 'Set of...',
    priority: 4,
    value: async ([{ type, settings }]) => (initializeSubs(registry, {
      type: SetType.forItem(type),
      settings: {
        input: 'list',
        defaultValue: [],
        options: SetListInput.getDefaultOptions(),
        sub: {
          value: settings,
        },
      },
    })),
  }),
};

export const SetModifierFromSimpleList: TypeModifier<SetType> =
{
  getOption: ({ registry, type, typeSettings, parent, noTransform }) => {

    if (!(type instanceof ListType) && !(type instanceof MapType)) {
      return false;
    }

    const item = 'item' in type.options
      ? type.options.item
      : type.options.value;
    const subSettings = typeSettings.sub
      ? 'item' in typeSettings.sub
        ? typeSettings.sub.item
        : 'value' in typeSettings.sub
          ? typeSettings.sub.value
          : null
      : null;

    if (!item.isSimple() || !subSettings) {
      return false;
    }

    return {
      text: 'Convert to Set',
      description: 'The type will be converted to a set which does not allow duplicate values',
      priority: 14,
      value: async () => {
        if (!await getConfirmation({ pref: PREF_SET_MODIFIER })) {
          return false;
        }

        const newType = SetType.forItem(item);

        const input = typeSettings.input in SetVisuals.inputs
          ? typeSettings.input
          : 'list';
        const options = typeSettings.input in SetVisuals.inputs
          ? typeSettings.options
          : SetListInput.getDefaultOptions();
        const sub = { value: subSettings };

        const updateEvent: TypeUpdateEvent = {
          type: newType,
          settings: {
            input,
            defaultValue: [],
            options,
            sub,
          },
        };

        if (!noTransform) {
          const result = await getProgram({
            title: 'Convert to Set',
            message: 'The expression that changes the type to a set.',
            confirm: 'Convert',
            registry,
            context: Types.object({
              parent: parent || NullType.baseType,
              value: type,
            }),
            program: Exprs.cast(type, newType),
            expectedType: newType,
          });
  
          if (!result) {
            return false;
          }

          updateEvent.transform = result.program;
        }

        return updateEvent;
      },
    };
  },
};

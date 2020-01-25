
import { NullType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { NullInput } from './NullTypes';
import NullEditor from './NullEditor.vue';



export const NullVisuals = createVisuals()({
  type: NullType,
  name: 'Null',
  description: 'Null value',
  describe: ({registry, type}) => 'Null value',
  describeLong: (registry, type, padding) => 'Null',
  stringify: ({ registry, type, value }) => 'null',
  toString: ({ value, type, process, processInvalid }) => {
    return process(value, type);
  },
  subNodes: () => [],
  subOptions: (registry, type) => [],
  subSettings: (registry, type, settings, sub) => null,
  settingsFor: ({ registry, sub }) => ({
    input: 'null',
    options: {},
    defaultValue: null,
  }),
  editor: NullEditor,
  defaultInput: 'null',
  inputsOrder: ['null'],
  inputs: { 
    null: NullInput,
  },
});

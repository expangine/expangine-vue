
import { ObjectType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import ObjectForm from './ObjectForm.vue';
import ObjectFormSettings from './ObjectFormSettings.vue';


export interface ObjectFormOptions
{
  title?: string;
  columns: Array<{
    prop: string;
    cols: number | string;
    sm?: number | string;
    md?: number | string;
    lg?: number | string;
    xl?: number | string;
    offset?: number | string;
    offsetSm?: number | string;
    offsetMd?: number | string;
    offsetLg?: number | string;
    offsetXl?: number | string;
  }>;
}

export const ObjectFormInput: TypeVisualInput<ObjectType, ObjectFormOptions, string> = 
{
  name: 'Form',
  description: 'A form gives you control on the order of the fields and how much space they take up.',
  input: ObjectForm,
  settings: ObjectFormSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    columns: [],
  }),
  getName: (options) => options.title,
  getSummary: (options) => (
    `<strong>Form</strong>: ${options.title || ''}`
  ),
  onSubAdd: (prop, type, settings) => {
    const columns = settings.options.columns;
    const index = columns.findIndex((v) => v.prop === prop);
    if (index === -1) {
      columns.push({ prop, cols: 12 });
    }
  },
  onSubRemove: (prop, type, settings) => {
    const columns = settings.options.columns;
    const index = columns.findIndex((v) => v.prop === prop);
    if (index !== -1) {
      columns.splice(index, 1);
    }
  },
  onSubMove: (prop, newProp, type, settings) => {
    const columns = settings.options.columns;
    const index = columns.findIndex((v) => v.prop === prop);
    if (index !== -1) {
      columns[index].prop = newProp;
    }
  },
};

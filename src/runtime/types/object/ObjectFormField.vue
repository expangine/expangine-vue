<template>
  <ex-type-input
    :type="fieldType"
    :read-only="readOnly"
    :registry="registry"
    :settings="fieldSettings"
    v-model="field"
  ></ex-type-input>
</template>

<script lang="ts">
import { Type, ObjectType } from 'expangine-runtime';
import { ObjectFormOptions } from './ObjectFormTypes';
import { TypeSettings } from '../../TypeVisuals';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ObjectType, ObjectFormOptions, any, string>(Object).extend({
  name: 'ObjectFormField',
  props: {
    prop: {
      type: String,
      required: true,
    },
  },
  computed: {
    field: {
      get(): any {
        let current = this.value[this.prop];
        if (current === undefined && this.fieldSettings) {
          current = this.fieldType.fromJson(this.fieldSettings.defaultValue);
          this.$set(this.value, this.prop, current);
          current = this.value[this.prop];
          this.update();
        }
        return current;
      }, 
      set(value: any) {
        this.$set(this.value, this.prop, value);
        this.update();
      },
    },
    fieldSettings(): TypeSettings<any> | null {
      return this.settings.sub[this.prop];
    },
    fieldType(): Type {
      return this.type.options.props[this.prop];
    },
  },
});
</script>
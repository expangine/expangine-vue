<template>
  <ex-type-input
    :type="fieldType"
    :read-only="readOnly"
    :registry="registry"
    :settings="fieldSettings"
    :path="fieldPath"
    :data="data"
    v-model="field"
  ></ex-type-input>
</template>

<script lang="ts">
import { Type, TupleType } from 'expangine-runtime';
import { TypeSettings } from '../TypeVisuals';
import { TupleGridOptions } from './TupleGridTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<TupleType, TupleGridOptions, any, number>(Array).extend({
  name: 'TupleGridField',
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    field: {
      get(): any {
        let current = this.value[this.index];
        if (current === undefined && this.fieldSettings) {
          current = this.fieldType.fromJson(this.fieldSettings.defaultValue);
          this.$set(this.value, this.index, current);
          this.update();
        }
        return current;
      }, 
      set(value: any) {
        this.$set(this.value, this.index, value);
        this.update();
      },
    },
    fieldSettings(): TypeSettings<any> | null {
      return this.settings.sub[this.index];
    },
    fieldType(): Type {
      return this.type.options[this.index];
    },
    fieldPath(): Array<string | number> {
      return this.path.concat([this.index]);
    },
  },
});
</script>
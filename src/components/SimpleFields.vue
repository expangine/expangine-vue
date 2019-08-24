<template>
  <v-list>
    <template v-for="(field, fieldIndex) in fields">
      <v-list-item :key="field.name">
        <v-text-field
          v-if="field.type === 'text'"
          filled
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="field.details"
          :persistent-hint="!!field.details"
          :clearable="!field.required"
          :label="field.label"
          :value="value[field.name]"
          @input="setField(field, $event)"
        ></v-text-field>
        <v-combobox
          v-else-if="field.type === 'combo'"
          multiple
          pills
          filled
          small-chips
          deletable-chips
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="field.details"
          :persistent-hint="!!field.details"
          :items="field.items"
          :clearable="!field.required"
          :label="field.label"
          :value="value[field.name]"
          @input="setField(field, $event)"
        ></v-combobox>
        <v-select
          v-else-if="field.type === 'select'"
          filled
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="field.details"
          :persistent-hint="!!field.details"
          :items="field.items"
          :clearable="!field.required"
          :label="field.label"
          :value="value[field.name]"
          @input="setField(field, $event)"
        ></v-select>
        <v-text-field
          v-else-if="field.type === 'number'"
          filled
          type="number"
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="field.details"
          :persistent-hint="!!field.details"
          :clearable="!field.required && removeEmpty"
          :label="field.label"
          :value="value[field.name]"
          @input="setField(field, toNumber($event))"
          @click:clear="setField(field)"
        ></v-text-field>
        <ex-date-picker
          v-else-if="field.type === 'date'"
          :read-only="readOnly"
          :text-props="{ 
            filled: true, 
            clearable: !field.required, 
            label: field.label, 
            prependInnerIcon: 'mdi-calendar',
            hideDetails: hideDetails(field, fieldIndex),
            hint: field.details,
            persistentHint: !!field.details
          }"
          :value="value[field.name]"
          @input="setField(field, $event)"
        ></ex-date-picker>
        <ex-color-picker
          v-else-if="field.type === 'color'"
          filled
          :read-only="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="field.details"
          :persistent-hint="!!field.details"
          :clearable="!field.required"
          :label="field.label"
          :value="value[field.name]"
          @input="setField(field, $event)"
        ></ex-color-picker>
        <ex-simple-fields
          v-else-if="field.type === 'object'"
          :read-only="readOnly"
          :fields="field.fields"
          :value="value[field.name]"
          @input="setField(field, $event)"
        ></ex-simple-fields>
        <v-checkbox
          v-else-if="field.type === 'boolean'"
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="field.details"
          :persistent-hint="!!field.details"
          :label="field.label"
          :value="value[field.name]"
          :false-value="false"
          :true-value="true"
          @change="setField(field, $event)"
        ></v-checkbox>
        <div v-else>
          <strong>{{ field.type }}</strong> not supported.
        </div>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
import { TypeSettings } from '../runtime/TypeVisuals';
import { SimpleFieldOption } from '../common';


export default Vue.extend({
  name: 'ex-simple-fields',
  props: {
    value: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array as () => SimpleFieldOption[],
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    removeEmpty: {
      type: Boolean,
      default: false,
    },
    defaults: {
      type: Object,
    },
  },
  methods: {
    hideDetails(field: SimpleFieldOption, index: number) {
      const next = this.fields[index + 1];
      return !field.details && (!next || next.type === 'boolean');
    },
    toNumber(value: any) {
      const parsed = parseFloat(value);
      return isFinite(parsed) ? parsed : undefined;
    },
    setField(field: SimpleFieldOption, value: any) {
      const defaults = this.defaults;
      if (defaults && defaults[field.name] === value && !field.required) {
        this.$delete(this.value, field.name);
      } else if (this.removeEmpty && (value === undefined || value === null)) {
        this.$delete(this.value, field.name);
      } else {
        this.$set(this.value, field.name, value);
      }
      this.$emit('input', this.value);
    },
  },
});
</script>
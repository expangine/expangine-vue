<template>
  <v-list>
    <template v-for="(field, fieldIndex) in fields">
      <v-list-item :key="field.name">
        <v-text-field
          v-if="field.type === 'text'"
          filled
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="getDetails(field)"
          :persistent-hint="!!getDetails(field)"
          :error="!!getError(field)"
          :clearable="!field.required && !readOnly"
          :label="field.label"
          :value="value[field.name]"
          @change="setField(field, $event)"
          @click:clear="setField(field)"
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
          :hint="getDetails(field)"
          :persistent-hint="!!getDetails(field)"
          :error="!!getError(field)"
          :items="field.items"
          :clearable="!field.required && !readOnly"
          :label="field.label"
          :value="value[field.name]"
          @change="setField(field, $event)"
          @click:clear="setField(field)"
        ></v-combobox>
        <v-select
          v-else-if="field.type === 'select'"
          filled
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="getDetails(field)"
          :persistent-hint="!!getDetails(field)"
          :error="!!getError(field)"
          :items="field.items"
          :clearable="!field.required && !readOnly"
          :label="field.label"
          :value="value[field.name]"
          @input="setField(field, $event)"
          @click:clear="setField(field)"
        ></v-select>
        <v-text-field
          v-else-if="field.type === 'number'"
          filled
          type="number"
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="getDetails(field)"
          :persistent-hint="!!getDetails(field)"
          :error="!!getError(field)"
          :clearable="!field.required && !readOnly"
          :label="field.label"
          :value="value[field.name]"
          @change="setField(field, toNumber($event))"
          @click:clear="setField(field)"
        ></v-text-field>
        <ex-date-picker
          v-else-if="field.type === 'date'"
          :read-only="readOnly"
          :text-props="{ 
            filled: true, 
            clearable: !field.required && !readOnly, 
            label: field.label, 
            prependInnerIcon: 'mdi-calendar',
            hideDetails: hideDetails(field, fieldIndex),
            hint: getDetails(field),
            persistentHint: !!getDetails(field),
            error: !!getError(field)
          }"
          :value="value[field.name]"
          @input="setField(field, $event)"
          @click:clear="setField(field)"
        ></ex-date-picker>
        <ex-color-picker
          v-else-if="field.type === 'color'"
          :picker-props="{ showSwatches: true }"
          :read-only="readOnly"
          :text-props="{ 
            filled: true, 
            clearable: !field.required && !readOnly,
            label: field.label,
            appendIcon: 'mdi-format-color-fill',
            hideDetails: hideDetails(field, fieldIndex),
            hint: getDetails(field),
            persistentHint: !!getDetails(field),
            error: !!getError(field)
          }"
          :value="value[field.name]"
          @input="setField(field, $event)"
          @click:clear="setField(field)"
        ></ex-color-picker>
        <v-autocomplete
          v-else-if="field.type === 'icon'"
          filled
          :items="icons"
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="getDetails(field)"
          :persistent-hint="!!getDetails(field)"
          :error="!!getError(field)"
          :clearable="!field.required && !readOnly"
          :label="field.label"
          :value="value[field.name]"
          @input="setField(field, $event)"
          @click:clear="setField(field)"
        >
          <template #item="{ item, on }">
            <v-list-item v-on="on">
              <v-list-item-icon>
                <v-icon>{{ item.value }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-list-item-content v-else-if="field.type === 'object'">
          <h4>{{ field.label }}</h4>
          <ex-simple-fields
            v-if="value[field.name]"
            :read-only="readOnly"
            :fields="field.fields"
            :value="value[field.name]"
            @input="setField(field, $event)"
          ></ex-simple-fields>
          <v-btn v-else
            @click="addFieldObject(field)"
          >Add {{ field.label }}</v-btn>
        </v-list-item-content>
        <v-checkbox
          v-else-if="field.type === 'boolean'"
          class="mt-2 mb-3"
          :readonly="readOnly"
          :hide-details="hideDetails(field, fieldIndex)"
          :hint="getDetails(field)"
          :persistent-hint="!!getDetails(field)"
          :error="!!getError(field)"
          :label="field.label"
          :input-value="value[field.name]"
          @change="setField(field, $event)"
        ></v-checkbox>
        <template v-else-if="field.type === 'items'">
          <v-list class="pt-0">
            <v-list-item>
              <v-list-item-icon class="ma-0 mr-2 pt-1">
                <v-btn icon color="primary" @click="addItem(field)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-list-item-icon>
              <v-list-item-content class="pa-0">
                <v-list-item-title>{{ field.label }}</v-list-item-title>
                <v-list-item-subtitle>{{ field.details }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <template v-for="(item, itemIndex) in getItems(field)">
              <v-list-item :key="itemIndex">
                <v-list-item-icon class="mr-2 pt-1">
                  <v-btn icon @click="removeItem(field, itemIndex)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-content class="pa-0">
                  <v-container class="pa-0">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          filled
                          hide-details
                          label="Text"
                          type="text"
                          :readonly="readOnly"
                          :value="item.text"
                          @change="setItemText(field, itemIndex, $event)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          filled
                          hide-details
                          label="Value"
                          :type="field.valueType || 'text'"
                          :readonly="readOnly"
                          :value="item.value"
                          @change="setItemValue(field, itemIndex, $event)"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </template>
        <template v-else>
          <strong>{{ field.type }}</strong> not supported.
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
import { isArray } from 'expangine-runtime';
import { SimpleFieldOption } from '../common';
import { Icons } from '../app/Icons';



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
  },
  computed: {
    icons: () => Icons,
  },
  methods: {
    hideDetails(field: SimpleFieldOption, index: number): boolean {
      const next = this.fields[index + 1];
      return !this.getDetails(field) && (!next || next.type === 'boolean');
    },
    getDetails(field: SimpleFieldOption): string {
      const error = this.getError(field);
      return error || field.details || '';
    },
    getError(field: SimpleFieldOption): string {
      if (field.getError) {
        const error = field.getError(this.value[field.name], this.value);
        if (error) {
          return error;
        }
      }
      return '';
    },
    toNumber(value: any): number | undefined {
      const parsed = parseFloat(value);
      return isFinite(parsed) ? parsed : undefined;
    },
    setField(field: SimpleFieldOption, value: any) {
      const isEmpty = value === undefined || value === null || value === field.defaultValue;
      if (isEmpty && !field.required) {
        this.$delete(this.value, field.name);
      } else {
        this.$set(this.value, field.name, value);
      }
      this.update();
    },
    addFieldObject(field: SimpleFieldOption) {
      this.$set(this.value, field.name, {});
      this.update();
    },
    getItems(field: SimpleFieldOption) {
      let items = this.value[field.name];
      if (!isArray(items)) {
        this.$set(this.value, field.name, items = []);
      }
      return items;
    },
    removeItem(field: SimpleFieldOption, index: number) {
      const items = this.getItems(field);
      items.splice(index, 1);
      this.update();
    },
    setItemText(field: SimpleFieldOption, index: number, text: string) {
      const items = this.getItems(field);
      this.$set(items[index], 'text', text);
      this.update();
    },
    setItemValue(field: SimpleFieldOption, index: number, value: string) {
      const items = this.getItems(field);
      this.$set(items[index], 'value', value);
      this.update();
    },
    addItem(field: SimpleFieldOption) {
      const items = this.getItems(field);
      const count = items.length + 1;
      items.push({
        text: 'Text #' + count,
        value: field.valueType === 'number' ? count : 'Value #' + count,
      });
      this.update();
    },
    update() {
      this.$emit('input', this.value);
    },
  },
});
</script>
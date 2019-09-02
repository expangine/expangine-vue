<template>
  <v-list-item v-if="hasValue" class="pa-0">
    <v-list-item-avatar class="cell-top mr-1 pt-2">
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn icon @click="removeValue" v-on="on">
            <v-icon>{{ removeIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ removeLabel }}</span>
      </v-tooltip>
    </v-list-item-avatar>
    <v-list-item-content class="pa-0 pt-1">
      <ex-type-input
        :type="type.options"
        :read-only="readOnly"
        :registry="registry"
        :settings="settings.sub.innerType"
        v-model="computedValue"
      ></ex-type-input>
    </v-list-item-content>
  </v-list-item>
  <v-btn v-else @click="addValue" class="mt-3">
    Add {{ valueName }}
  </v-btn>
</template>

<script lang="ts">
import { OptionalType } from 'expangine-runtime';
import { OptionalOptions, OptionalSubs } from './OptionalTypes';
import { PropTypeAny } from '../../../common';
import { getConfirmation } from '../../../app/Confirm';
import { TypeVisuals, TypeVisualInput, TypeSettings } from '../../TypeVisuals';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<OptionalType, OptionalOptions, any, OptionalSubs>(PropTypeAny).extend({
  name: 'Optional',
  computed: {
    hasValue: {
      cache: false,
      get(): boolean {
        return this.value !== undefined;
      },
    },
    innerTypeVisuals(): TypeVisuals {
      return this.registry.getVisuals(this.type.options);
    },
    innerTypeSettings(): TypeSettings<any> {
      return this.settings.sub.innerType;
    },
    innerTypeInput(): TypeVisualInput<any, any> {
      return this.innerTypeVisuals.inputs[this.innerTypeSettings.input];
    },
    valueName(): string {
      return this.innerTypeInput.getName(this.innerTypeSettings.options) || this.innerTypeVisuals.name;
    },
    removeIcon(): string {
      return this.settings.options.removeIcon || 'mdi-minus';
    },
    removeLabel(): string {
      return this.settings.options.removeLabel || 'Remove Optional Value';
    },
  },
  methods: {
    async removeValue() {
      if (!await getConfirmation()) {
        return;
      }
      this.$emit('input', undefined);
    },
    addValue() {
      this.$emit('input', this.type.options.fromJson(this.innerTypeSettings.defaultValue));
      this.$forceUpdate();
    },
  },
});
</script>

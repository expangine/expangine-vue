<template>
  <v-list-item>
    <v-list-item-avatar class="ex-cell-top mr-0 pt-1">
      <ex-type-editor-menu
        v-bind="$props"
        icon="mdi-help-circle-outline"
        @change="triggerChange"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content class="pa-0">
      <ex-type-editor
        v-bind="$props"
        :type="type.options"
        :required-type="requiredInner"
        :required-type-options="requiredTypeOptions"
        :parent="type"
        :settings="settings.sub.innerType"
        :disable-sub-settings="false"
        @change="onChange"
      ></ex-type-editor>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Type, OptionalType, Exprs } from 'expangine-runtime';
import { TypeUpdateEvent } from '../TypeVisuals';
import { OptionalSubs, OptionalOptions } from './OptionalTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<OptionalType, OptionalOptions, OptionalSubs>().extend({
  name: 'OptionalEditor',
  computed: {
    requiredInner(): Type | null {
      return this.requiredType && this.requiredType instanceof OptionalType
        ? this.requiredType.options
        : null;
    },
  },
  methods: {
    onChange(event: TypeUpdateEvent) {
      const previousType = this.type.options;
      
      const transform = event.transform
        ? this.type.getValueChangeExpression(event.transform, OptionalType.STEP_OPTIONAL, OptionalType.STEP_OPTIONAL)
        : undefined;

      this.type.options = event.type;
      this.settings.sub.innerType = event.settings;

      this.change({ transform });
    },
  },
});
</script>

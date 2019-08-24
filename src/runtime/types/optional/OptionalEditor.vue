<template>
  <v-list-item>
    <v-list-item-avatar class="cell-top mr-0 pt-1">
      <v-menu 
        :close-on-content-click="false"
        v-model="menu"
      >
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="makeRequired">
            Make Required
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-avatar>
    <v-list-item-content class="pa-0">
      <ex-type-editor
        :type="type.options"
        :parent="type"
        :settings="settings.sub.innerType"
        :registry="registry"
        :read-only="readOnly"
        @input:type="updateType"
        @input:settings="updateSettings"
        @change:type="onChangeType"
      ></ex-type-editor>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { OptionalType } from 'expangine-runtime';
import { TypeAndSettings } from '../../TypeVisuals';
import { confirm } from '../../../app/Confirm';
import { OptionalSubs, OptionalOptions } from './OptionalTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<OptionalType, OptionalOptions, OptionalSubs>().extend({
  name: 'OptionalEditor',
  data: () => ({
    menu: false,
  }),
  methods: {
    async makeRequired() {
      if (!await confirm()) {
        return;
      }

      this.changeType({ 
        type: this.type.options, 
        settings: this.settings.sub.innerType,
      });
    },
    onChangeType({ type: innerType, settings }: TypeAndSettings) {
      this.type.options = innerType;
      this.settings.sub.innerType = settings;

      this.updateTypeAndSettings();
    },
  },
});
</script>

<style scoped>
.cell-top {
  align-self: start;
}
</style>

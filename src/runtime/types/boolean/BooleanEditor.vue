<template>
  <v-list-item>
    <v-list-item-avatar class="cell-top pt-1 mr-3">
      <ex-type-editor-menu
        :type="type"
        :settings="settings"
        :registry="registry"
        :parent="parent"
        :read-only="readOnly"
        :disable-sub-settings="disableSubSettings"
        @input:type="updateType"
        @input:settings="updateSettings"
        @change:type="changeType"
      >
        <template #configure>
          <v-list-item>
            <v-list-item-content>
              <v-combobox
                multiple
                small-chips
                clearable
                filled
                hide-details
                label="True Text"
                placeholder="true, 1, y, yes, x"
                v-model="trues"
                :disabled="readOnly"
                @input="updateValue"
              ></v-combobox>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-combobox
                multiple
                small-chips
                clearable
                filled
                hide-details
                label="False Text"
                placeholder="false, 0, n, no"
                :disabled="readOnly"
                v-model="falses"
                @input="updateValue"
              ></v-combobox>
            </v-list-item-content>
          </v-list-item>
        </template>
      </ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="primary--text">
        <strong>Boolean</strong> 
      </v-list-item-title>
      <v-list-item-subtitle 
        v-if="!disableSubSettings"
        v-html="summary"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { BooleanType, BooleanOptions } from 'expangine-runtime';
import TypeEditorBase from '../TypeEditorBase';

export default TypeEditorBase<BooleanType, any>().extend({
  name: 'BooleanEditor',
  data: () => ({
    trues: [] as string[],
    falses: [] as string[],
  }),
  watch: {
    type: {
      immediate: true,
      handler(type: BooleanType) {
        if (type && type.options) {
          this.trues = type.options.true ? Object.keys(type.options.true) : [];
          this.falses = type.options.false ? Object.keys(type.options.false) : [];
        }
      },
    },
  },
  methods: {
    updateValue() {
      const options: BooleanOptions = {};
      if (this.trues.length > 0) {
        options.true = this.trues.reduce((out, item) => (out[item] = true, out), {} as Record<string, true>);
      }
      if (this.falses.length > 0) {
        options.false = this.falses.reduce((out, item) => (out[item] = true, out), {} as Record<string, true>);
      }
      this.type.options = options;
      this.$emit('update', this.type);
    },
  },
});
</script>

<style lang="sass" scoped>

</style>

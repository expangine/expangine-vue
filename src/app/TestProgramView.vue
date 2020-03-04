<template>
  <div>
    <ex-type-input
      v-if="isReady"
      :registry="registry"
      :type="inputType"
      :settings="settings"
      :value="data"
      v-focus-on-create="'input, textarea, select'"
      @input="setInput"
    ></ex-type-input>

    <div class="ex-center-aligned mt-3 px-3">
      <h4>Results</h4>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!automatic"
        icon
        class="mr-3"
        color="secondary"
        @click="updateResult(true)"
      ><v-icon>mdi-sync</v-icon></v-btn>
      <v-checkbox
        hide-details
        class="mt-0"
        label="Auto Update"
        v-model="automatic"
        @change="updateResult"
      ></v-checkbox>
    </div>
    <ex-data-string-box
      class="ma-3 mt-6"
      max-height="300px"
      quotes
      :registry="registry"
      :data="result"
    ></ex-data-string-box>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, DataTypes } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { TypeSettings } from '../runtime/types/TypeVisuals';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    program: {
      type: Object as () => Expression,
      required: true,
    },
    inputType: {
      type: Object as () => Type,
      required: true,
    },
    input: {
      default: null,
    },
    inputSettings: {
      type: Object as () => TypeSettings,
      default: null,
    },
    resultAutomatic: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    data: null as any,
    settings: null as null | TypeSettings,
    invalid: false,
    result: null,
    automatic: true,
  }),
  computed: {
    isReady(): boolean {
      return this.data !== null && this.settings !== null;
    },
  },
  watch: {
    resultAutomatic: {
      immediate: true,
      handler(auto: boolean) {
        this.automatic = auto;
      },
    },
    inputType: {
      immediate: true,
      handler(type: Type) {
        this.data = type.isValid(this.data)
          ? this.data
          : type.isValid(this.input) 
            ? this.input 
            : type.create();
        this.settings = this.registry.getTypeSettingsValidFor(type, this.inputSettings)
          ? this.inputSettings
          : this.registry.getTypeSettings(type);
      },
    },
    program: {
      immediate: true, 
      handler() {
        this.updateResult();
      },
    },
  },
  methods: {
    setInput(input: any) {
      this.data = input;
      this.updateResult();
    },
    updateResult(forceUpdate: boolean = false) {
      if (!this.automatic && !forceUpdate) {
        return;
      }

      try {
        this.invalid = false;

        const cmd = LiveRuntime.getCommand(this.program);
        const data = DataTypes.copy(this.data);

        this.result = cmd(data);

        if (LiveRuntime.returnProperty in data) {
          this.result = data[LiveRuntime.returnProperty];
        }
      } catch (e) {
        this.invalid = true;
      }
    },
  },
});
</script>
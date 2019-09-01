<template>
  <v-menu 
    offset-x
    max-width="300"
    :disabled="readOnly"
    :close-on-content-click="false" 
    v-model="menu"
  >
    <template #activator="{ on }">
      <v-text-field
        v-bind="$props"
        v-model="textValue"
        append-icon="mdi-format-color-fill"
        @click:append="menu = true"
        @click:clear="$emit('click:clear')"
      ></v-text-field>
    </template>
    <v-color-picker
      v-bind="$props"
      v-model="colorModel"
    ></v-color-picker>
    <v-toolbar dense>
      <v-btn text color="primary" @click="cancel">Cancel</v-btn>
      <div class="flex-grow-1"></div>    
      <v-btn color="primary" @click="ok">OK</v-btn>
    </v-toolbar>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: String,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    filled: {
      type: Boolean,
    },
    clearable: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    hint: {
      type: String,
    },
    showSwatches: {
      type: Boolean,
    },
    hideDetails: {
      type: Boolean,
    },
    persistentHint: {
      type: Boolean,
    },
  },
  data: () => ({
    menu: false,
    colorValue: '',
  }),
  computed: {
    textValue: {
      get(): string | undefined {
        return this.value || undefined;
      },
      set(value: string) {
        if (value === null) {
          this.colorValue = '';
        }
        this.input(value);
      },
    },
    colorModel: {
      get(): string | undefined {
        return this.colorValue || this.value || undefined;
      },
      set(color: any) {
        this.colorValue = color ? color.hex ? color.hex : color : undefined;
      },
    },
  },
  methods: {
    ok() {
      if (this.colorValue) {
        this.input(this.colorValue);
      }
      this.menu = false;
    },
    cancel()  {
      this.colorValue = '';
      this.menu = false;
    },
    input(value: string) {
      this.$emit('input', value);
    },
  },
});
</script>

<style scoped>

</style>
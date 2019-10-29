<template>
  <v-menu 
    v-bind="menuProps"
    v-model="menu"
    :disabled="readOnly"
  >
    <template #activator="{ on }">
      <v-text-field
        v-bind="textProps"
        v-model="textValue"
        @click:append="menu = true"
        @click:clear="clear"
      >
        <template #prepend>
          <v-sheet 
            width="30" 
            height="30" 
            elevation="2"
            class="color-block"
            :color="textValue"
            @click="menu = true"
          ></v-sheet>
        </template>
      </v-text-field>
    </template>
    <v-color-picker
      v-bind="pickerProps"
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
    textProps: {
      type: Object,
      default: () => ({}),
    },
    pickerProps: {
      type: Object,
      default: () => ({}),
    },
    menuProps: {
      type: Object,
      default: () => ({
        closeOnContentClick: false,
        offsetY: true,
        maxWidth: '300',
      }),
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
    clear() {
      this.$emit('click:clear');
    },
  },
});
</script>

<style lang="less" scoped>
.color-block {
  margin-top: -4px;
  cursor: pointer;
}
</style>
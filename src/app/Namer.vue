<template>
  <v-text-field
    outlined
    :error-messages="hint"
    :label="label"
    :error="error"
    :value="value"
    :append-icon="icon"
    :append-outer-icon="outerIcon"
    :readonly="readonly"
    :hide-details="hideDetails"
    v-model="internalValue"
    v-focus-on-create="'input'"
    @click:append="toggle"
    @click:append-outer="remove"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Name',
    },
    details: {
      type: String,
      default: '',
    },
    validate: {
      type: Function,
      default: null,
    },
    hideRemove: {
      type: Boolean,
      default: false,
    },
    autoValidate: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    editing: false,
    message: '',
    internalValue: '',
  }),
  computed: {
    hint(): string {
      return this.message || this.details;
    },
    persistentHint(): boolean {
      return !!this.hint;
    },
    hideDetails(): boolean {
      return !this.hint;
    },
    error(): boolean {
      return !!this.message;
    },
    icon(): string {
      return this.editing
        ? this.value === this.internalValue
          ? 'mdi-close'
          : 'mdi-check'
        : 'mdi-pencil';
    },
    readonly(): boolean {
      return !this.editing;
    },
    outerIcon(): string | undefined {
      return !this.hideRemove && !this.getInvalidMessage()
        ? 'mdi-delete' : undefined;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value: string) {
        this.internalValue = value;
        this.editing = !value;
      },
    },
    internalValue() {
      if (this.autoValidate) {
        this.setValidation();
      }
    },
  },
  methods: {
    setValidation(): boolean {
      this.message = this.getInvalidMessage();

      return !!this.message;
    },
    getInvalidMessage(): string {
      return this.validate
        ? this.validate(this.internalValue)
        : '';
    },
    remove() {
      this.$emit('remove', this.internalValue);
    },
    toggle() {
      if (!this.editing) {
        this.editing = true;
        return;
      }

      this.message = '';

      if (this.value === this.internalValue) {
        this.editing = false;
        return;
      }

      if (this.setValidation()) {
        return;
      }

      this.$emit('input', this.internalValue);
    },
  },
});
</script>
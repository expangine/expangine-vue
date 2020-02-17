<template>
  <div class="ex-shortcut-input">
    <v-btn :color="color" @click="capture">
      <v-icon>{{ icon }}</v-icon>
      &nbsp;
      {{ text }}
    </v-btn>
    <span class="ml-3">
      {{ label }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Shortcut, Shortcuts, newShortcut } from './Shortcuts';


export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    capturing: false,
    captured: newShortcut(),
  }),
  computed: {
    shortcut(): Shortcut {
      return Shortcuts.shortcutFromCode(this.value);
    },
    shortcutText(): string {
      return Shortcuts.nameFromShortcut(this.shortcut);
    },
    text(): string {
      return this.capturing
        ? Shortcuts.nameFromShortcut(this.captured)
        : Shortcuts.nameFromShortcut(this.shortcut);
    },
    color(): string {
      return this.capturing ? 'error' : 'primary';
    },
    icon(): string {
      return this.capturing ? 'mdi-record' : 'mdi-keyboard';
    },
  },
  methods: {
    capture() {
      const capture = Shortcuts.capture();

      this.capturing = true;
      this.captured = Shortcuts.captured;

      this.finishCapture(capture);
    },
    async finishCapture(capture: Promise<Shortcut>) {
      const captured = await capture;

      this.capturing = false;
      this.captured = newShortcut();

      this.$emit('input', Shortcuts.codeFromShortcut(captured));
    },
  },
});
</script>

<style lang="less" scoped>
.ex-shortcut-input {
  display: flex;
  align-items: center;

  > span {
    color: rgba(0, 0, 0, 0.54);
    line-height: 20px;
    font-size: 16px;
    flex: 1 1;
    min-width: fit-content;
  }
  
}
</style>
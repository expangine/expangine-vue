<template>
  <div>
    {{ label }}:
    <strong>[ {{ shortcutText }} ]</strong>
    <v-btn absolute right :color="color" @click="capture">
      <v-icon>{{ icon }}</v-icon>
      &nbsp;
      {{ text }}
    </v-btn>
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
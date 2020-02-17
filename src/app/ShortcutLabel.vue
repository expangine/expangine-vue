<template>
  <span class="ex-shortcut-label">
    {{ label }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Shortcut, Shortcuts } from './Shortcuts';
import { Preferences, Preference } from './Preference';


export default Vue.extend({
  props: {
    code: {
      type: String,
    },
    pref: {
      type: [String, Object as () => Preference],
    },
    shortcut: {
      type: Object as () => Shortcut,
    },
  },
  computed: {
    label(): string {
      if (this.code) {
        return Shortcuts.nameFromCode(this.code);
      }
      if (this.pref) {
        return Shortcuts.nameFromCode(Preferences.get(this.pref, ''));
      }
      if (this.shortcut) {
        return Shortcuts.nameFromShortcut(this.shortcut);
      }

      return '';
    },
  },
});
</script>

<style lang="less" scoped>
.ex-shortcut-label {
  float: right;
  font-size: 12px;
  color: #888;
}
</style>
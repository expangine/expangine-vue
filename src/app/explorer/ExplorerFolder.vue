<template>
  <div :style="style">
    <v-list-item  @click="toggle">
      <slot name="prepend" v-bind="{ opener }">
        <v-list-item-icon class="mr-3">
          <v-badge overlap :content="count" :value="countVisible">
            <v-icon>{{ icon }}</v-icon>
          </v-badge>
        </v-list-item-icon>
      </slot>
      <v-list-item-content>
        {{ name }}
      </v-list-item-content>
      <slot name="append" v-bind="{ opener }"></slot>
    </v-list-item>
    <div :style="filesStyle" class="pl-6">
      <slot name="files" v-bind="{ opener }"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { NamedMap } from 'expangine-runtime';
import { ExplorerTab, isNameVisible } from './ExplorerTypes';
import { Registry } from '../../runtime/Registry';


export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    nameFilter: {
      type: String,
      default: '',
    },
    filesVisible: {
      type: Boolean,
      default: true,
    },
    showCount: {
      type: [Number, Boolean],
      default: false,
    },
    showCountOnClose: {
      type: [Number, Boolean],
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    open: true,
  }),
  computed: {
    icon(): string {
      return this.isOpen ? 'mdi-folder-open' : 'mdi-folder';
    },
    style(): any {
      return { display: this.visible ? '' : 'none' };
    },
    filesStyle(): any {
      return { display: this.isOpen ? '' : 'none' };
    },
    folderVisible(): boolean {
      return isNameVisible(this.name, this.nameFilter);
    },
    visible(): boolean {
      return this.folderVisible || this.filesVisible;
    },
    filtering(): boolean {
      return !!this.nameFilter;
    },
    isOpen(): boolean {
      return this.open || (this.filtering && this.filesVisible);
    },
    countVisible(): boolean {
      return !!(this.showCount || (this.showCountOnClose && !this.isOpen)) && this.count > 0;
    },
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    opener() {
      this.open = true;
    },
  },
});
</script>
<template>
  <v-list-item :style="style" @click="clicked" v-click-outside="blur">
    <slot name="prepend">
      <v-list-item-icon v-if="icon" class="mr-3">
        <v-badge overlap :content="count" :value="showCount">
          <v-icon>{{ icon }}</v-icon>
        </v-badge>
      </v-list-item-icon>
    </slot>
    <v-list-item-content class="pa-0">
      <span v-if="hideRename">
        {{ name }}
      </span>
      <span v-else>
        <v-text-field
          v-if="editing"
          dense 
          solo 
          flat
          single-line
          hide-details
          :value="name"
          @change="rename"
          @blur="cancel"
          @keydown.esc="cancel"
          v-focus-on-create="'input'"
        ></v-text-field>
        <span v-else>
          {{ name }}
        </span>
      </span>
    </v-list-item-content>
    <slot name="append"></slot>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue';
import { Entity } from 'expangine-runtime';
import { ExplorerTab, isNameVisible } from './ExplorerTypes';


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
    icon: {
      type: String,
      default: null,
    },
    hideRename: {
      type: Boolean,
      default: false,
    },
    autoOpen: {
      type: String,
      default: '',
    },
    showCount: {
      type: [Number, Boolean],
      default: false,
    },
    count: {
      type: [Number, String],
      default: 0,
    },
  },
  data: () => ({
    id: Entity.uuid(),
    editing: false,
    tab: null as null | ExplorerTab,
    focused: false,
  }),
  computed: {
    visible(): boolean {
      return isNameVisible(this.name, this.nameFilter);
    },
    style(): any {
      return { display: this.visible ? '' : 'none' };
    },
  },
  watch: {
    name(name: string) {
      if (this.tab) {
        this.tab.name = name;
      }
    },
    autoOpen: {
      immediate: true,
      handler(autoOpen: string) {
        if (autoOpen === this.name) {
          this.$emit('update:auto-open', null);
          this.open();
        }
      },
    },
  },
  destroyed() {
    this.close();
  },
  methods: {
    rename(name: string) {
      this.$emit('rename', name);
      this.cancel();
    },
    blur() {
      this.focused = false;
    },
    edit() {
      this.editing = !this.editing;
      if (!this.editing) {
        this.focused = false;
      }
    },
    cancel() {
      this.editing = false;
      this.focused = false;
    },
    getTab(): ExplorerTab {
      const { id, name, icon, close } = this;

      return {
        id,
        name,
        icon,
        close,
        component: '',
        bind: {},
        on: {},
        ...this.getTabComponent(),
      };
    },
    getTabComponent(): Partial<ExplorerTab> {
      return {};
    },
    clicked() {
      if (this.focused) {
        this.edit();
      } else {
        this.focused = true;
        this.open();
      }
    },
    open() {
      if (!this.tab) {
        this.tab = this.getTab();
      }
      this.$emit('open', this.tab);
    },
    close() {
      if (this.tab) {
        this.$emit('close', this.tab);
        this.tab = null;
      }
    },
  },
});
</script>
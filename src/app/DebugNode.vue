<template>
  <div class="pa-1">
    <div @click="toggle">
      <v-chip small label
        v-if="subString"
        v-html="subString"
      ></v-chip>
      <span 
        class="ml-1"
        v-if="!hasSubs" 
        v-html="valueString"
      ></span>
      <span v-if="hasSubs">
        {{ valueTypeName }}
        <v-icon v-if="open">mdi-menu-up</v-icon>
        <v-icon v-else>mdi-menu-down</v-icon>
      </span>
    </div>
    <div v-if="hasSubs && open" class="pl-4">
      <template v-for="(sub, subIndex) in subs">
        <debug-node
          :key="subIndex"
          :node="sub"
          :registry="registry"
        ></debug-node>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DebugStep } from './DebugProgram';
import { Registry } from '../runtime/Registry';
import { Type } from 'expangine-runtime';
import { TypeSubNode } from '../runtime/types/TypeVisuals';
import { getToStringSettings } from '@/common';


export const toString = getToStringSettings();
export const toStringSub = getToStringSettings(false, false);

export default Vue.extend({
  name: 'debug-node',
  props: {
    node: {
      type: Object as () => TypeSubNode,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  data: () => ({
    open: false,
  }),
  computed: {
    subs(): TypeSubNode[] {
      return this.registry.getTypeSubNodes(this.node.value, this.node.valueType);
    },
    hasSubs(): boolean {
      return this.subs.length > 0;
    },
    subString(): string {
      return this.node.subType
        ? this.registry.getTypeToString(this.node.sub, this.node.subType, toStringSub.tab, toStringSub.newline, '', toStringSub.process, toStringSub.processInvalid)
        : this.node.sub + '';
    },
    valueString(): string {
      return this.node.valueType
        ? this.registry.getTypeToString(this.node.value, this.node.valueType, toString.tab, toString.newline, '', toString.process, toString.processInvalid)
        : this.node.value + '';
    },
    valueTypeName(): string {
      return this.registry.getTypeVisuals(this.node.valueType).name;
    },
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
  },
});
</script>
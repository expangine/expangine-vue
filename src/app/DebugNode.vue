<template>
  <div class="pt-1">
    <div @click="toggle">
      <v-chip small label v-if="subString">
        <ex-data-string
          single-line
          :registry="registry"
          :data="node.sub"
          :type="node.subType"
          @string="subString"
        ></ex-data-string>
      </v-chip>
      <ex-data-string
        v-if="!hasSubs" 
        class="ml-1"
        quotes
        :registry="registry"
        :data="node.value"
        :type="node.valueType"
      ></ex-data-string>
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
    subString: '?',
  }),
  computed: {
    subs(): TypeSubNode[] {
      return this.registry.getTypeSubNodes(this.node.value, this.node.valueType);
    },
    hasSubs(): boolean {
      return this.subs.length > 0;
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
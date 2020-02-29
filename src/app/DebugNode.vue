<template>
  <div class="pt-1">
    <div @click="toggle">
      <v-chip small label v-if="subString">
        <ex-data-string
          single-line
          :registry="registry"
          :data="node.sub"
          :type="node.subType"
          @string="subString = $event"
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
      <template v-for="(group, groupIndex) in subsGroups">
        <div :key="groupIndex">
          <template v-for="(sub, subIndex) in group">
            <debug-node
              :key="subIndex"
              :node="sub"
              :registry="registry"
            ></debug-node>
          </template>
        </div>
      </template>
      <div v-if="hasMore">
        <v-btn small block text @click="addMore">Show More</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DebugStep } from './Debugger';
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
    groupSize: {
      type: Number,
      default: 10,
    },
  },
  data: () => ({
    open: false,
    subString: '?',
    subsGroups: [] as TypeSubNode[][],
  }),
  computed: {
    subs(): TypeSubNode[] {
      return this.registry.getTypeSubNodes(this.node.value, this.node.valueType);
    },
    hasMore(): boolean {
      return this.subsGroups.length * this.groupSize < this.subs.length;
    },
    hasSubs(): boolean {
      return this.subs.length > 0;
    },
    valueTypeName(): string {
      return this.registry.getTypeVisuals(this.node.valueType).name;
    },
  },
  watch: {
    subs: {
      immediate: true,
      handler() {
        const count = this.subsGroups.length;
        const size = this.groupSize;
        const offset = count * size;

        this.subsGroups = [this.subs.slice(offset, offset + size)];
      },
    },
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    addMore() {
      const count = this.subsGroups.length;
      const size = this.groupSize;
      const offset = count * size;

      this.subsGroups.push(this.subs.slice(offset, offset + size));
    },
  },
});
</script>
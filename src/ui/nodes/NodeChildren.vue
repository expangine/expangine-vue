<template>
  <div 
    :class="classes" 
    @dragenter="hover = true"
    @dragleave="hover = false"
  >
    <ex-draggable 
      v-model="draggables" 
      group="nodes"
      draggable=".ex-node"
    >
      <template v-for="(drag, index) in draggables">
        <ex-node-viewer
          class="ex-node"
          v-bind="$props"
          :key="drag.id"
          :value="drag.node"
          @input="updateNode(index, $event)"
          @select="selectNode(index, $event)"
        ></ex-node-viewer>
      </template>
      <template #footer v-if="showDropTarget">
        <v-alert
          dense
          colored-border
          border="left"
          elevation="1"
          icon="mdi-target"
          color="blue-grey"
          class="mb-0"
        >
          {{ targetText }}
        </v-alert>
      </template>
    </ex-draggable>
  </div>
</template>

<script lang="ts">
import { NodeTemplateChild } from 'expangine-ui';
import { NodeDraggable, NodeSelection } from './NodeVisuals';
import NodeViewerBase from './NodeViewerBase';


export default NodeViewerBase().extend({
  props: {
    value: {
      type: Array as () => NodeTemplateChild[],
      required: true,
    },
    targetText: {
      type: String,
      default: 'Empty',
    },
  },
  data: () => ({
    cache: [] as NodeDraggable[],
    hover: false,
  }),
  computed: {
    showDropTarget(): boolean {
      return this.value.length === 0;
    },
    classes(): any {
      return {
        'ex-node-children': true,
        'ex-drop-hover': this.hover,
      };
    },
    draggables: {
      get(): NodeDraggable[] {
        this.cache = this.value.map((node) => (
          this.cache.find((c) => c.node === node) || 
          { id: Math.random(), node }
        ));

        return this.cache;
      },
      set(draggables: NodeDraggable[]) {
        this.input(draggables.map((c) => c.node) as any);
      },
    },
    showEmpty(): boolean {
      return this.value.length === 0 && !this.readOnly;
    },
  },
  methods: {
    updateNode(index: number, updated: NodeTemplateChild) {
      this.$set(this.value, index, updated);
      this.update();
    },
    removeItem(index: number) {
      this.value.splice(index, 1);
      this.update();
    },
    selectNode(index: number, selection: NodeSelection) {
      if (!selection.children) {
        selection.children = this.value;
        selection.childIndex = index;
      }
      this.$emit('select', selection);
    },
  },
});
</script>

<style lang="less" scoped>
.ex-node-children {
  border: 1px solid transparent;

  &.ex-drop-hover {
    border: 1px solid rgba(255,0,0,0.1);
  }
}
</style>
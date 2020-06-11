<template>
  <v-menu v-if="visible" v-bind="menuProps">
    <template #activator="{ on }">
      <v-btn icon v-on="on" v-focus-on-change.last="[changes, 'self']">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-list two-line class="py-0">
      <ex-child-filter>
        <slot name="prepend"></slot>
        <template v-for="(sub, index) in nextSegments">
          <v-list-item :key="index" @click="addSegment(sub)">
            <v-list-item-content>
              <v-list-item-title>
                {{ sub.text }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ sub.description }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="contextDetails[sub.text]">
                {{ contextDetails[sub.text] }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-if="allowComputed">
          <template v-for="comp in nextComputed">
            <v-list-item :key="comp.value.id" @click="addComputed(comp)">
              <v-list-item-content>
                <v-list-item-title>{{ comp.text }}</v-list-item-title>
                <v-list-item-subtitle>{{ comp.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
        <template v-if="allowMethods">
          <template v-for="method in nextMethods">
            <v-list-item :key="method.value.name" @click="addMethod(meth)">
              <v-list-item-content>
                <v-list-item-title>{{ meth.text }}</v-list-item-title>
                <v-list-item-subtitle>{{ meth.value.description || meth.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
        <slot name="append"></slot>
      </ex-child-filter>
    </v-list>
  </v-menu>
  <span v-else-if="visibleDot">.</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, objectToArray, EntityType } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { TypeSubOption, TypeComputedOption, TypeMethodOption } from '../runtime/types/TypeVisuals';


export default Vue.extend({
  props: {
    type: {
      type: Object as () => Type,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    contextDetails: {
      type: Object as () => Record<string, string>,
    },
    allowComputed: {
      type: Boolean,
      default: false,
    },
    allowMethods: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    hide: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'mdi-chevron-right',
    },
    menuProps: {
      type: Object,
      default: () => ({ maxHeight: 400, offsetY: true }),
    },
    changes: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    visible(): boolean {
      return !this.hide && this.hasNext && !this.readOnly;
    },
    visibleDot(): boolean {
      return !this.hide && this.hasNext && this.readOnly;
    },
    hasNext(): boolean {
      return this.nextSegments.length > 0 || (this.allowComputed && this.nextComputed.length > 0);
    },
    nextSegments(): TypeSubOption[] {
      const segments = this.registry.getTypeSubOptions(this.type);

      const sorted = segments.slice();

      sorted.sort((a, b) => {
        const ad = a.key instanceof Type ? 1 : 0;
        const bd = b.key instanceof Type ? 1 : 0;

        return ad - bd;
      });

      return sorted;
    },
    nextComputed(): TypeComputedOption[] {
      return this.registry.getTypeComputedOptions(this.type);
    },
    nextMethods(): TypeMethodOption[] {
      if (!(this.type instanceof EntityType)) {
        return [];
      }

      const entity = this.registry.defs.getEntity(this.type.options);

      if (!entity) {
        return [];
      }

      return objectToArray(entity.methods, (func, funcName) => ({
        text: funcName,
        description: 'Call user-defined method',
        value: func,
      }));
    },
  },
  methods: {
    addSegment(sub: TypeSubOption) {
      this.$emit('segment', sub);
    },
    addComputed(comp: TypeComputedOption) {
      this.$emit('computed', comp);
    },
    addMethod(meth: TypeMethodOption) {
      this.$emit('method', meth);
    },
  },
});
</script>
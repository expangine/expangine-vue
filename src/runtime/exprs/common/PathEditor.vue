<template>
  <span class="ex-center-aligned">

    <path-segment
      v-if="hasSegment"
      v-bind="$props"
      :index="0"
      :sub-settings="settings"
      :allow-computed="allowComputed"
      @input="input"
      @remove="remove"
      @settings="onSettings"
    ></path-segment>

    <next-menu
      :type="nextType"
      :registry="registry"
      :context-details="contextDetails"
      :hide="hideNext"
      :allow-computed="allowComputed"
      :read-only="readOnly"
      @segment="addSegment"
      @computed="addComputed"
    ></next-menu>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, Type, NoExpression, ExpressionBuilder, ComputedExpression, SubExpression } from 'expangine-runtime';
import { TypeSubOption, TypeSettings, TypeComputedOption } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';
import PathSegment from './PathSegment.vue';
import NextMenu from '@/app/NextMenu.vue';


const ex = new ExpressionBuilder();

export default ExpressionBase().extend({
  name: 'PathEditor',
  components: {
    PathSegment,
    NextMenu,
  },
  props: {
    path: {
      type: Array as () => Expression[],
      required: true,
    },
    root: {
      type: Object as () => Type | null,
      default: null,
    },
    allowComputed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasSegment(): boolean {
      return this.path.length > 0;
    },
    rootType(): Type {
      return this.root || this.context;
    },
    pathType(): Type | null {
      return this.registry.defs.getPathType(this.path, this.rootType);
    },
    nextType(): Type {
      return this.pathType || this.rootType;
    },
    hideNext(): boolean {
      return this.value.parent && (
        this.value.parent instanceof SubExpression || 
        this.value.parent instanceof ComputedExpression
      );
    },
  },
  methods: {
    onSettings(settings: TypeSettings | null) {
      this.$emit('settings', settings);
    },
    addSegment(sub: TypeSubOption) {
      if (sub.key instanceof Type) {
        const visual = this.registry.getTypeVisuals(sub.key);
        const segment = ex.const(visual.type.baseType.create());
        this.path.push(segment);
      } else {
        const segment = ex.const(sub.key);
        this.path.push(segment);
      }

      this.update();
    },
    addComputed(comp: TypeComputedOption) {
      this.input(new ComputedExpression(this.value, comp.value.id));
    },
  },
});
</script>
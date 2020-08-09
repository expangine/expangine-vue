<template>
  <span class="ex-center-aligned">
    <ex-expression-menu
      v-if="hasValue"
      v-bind="$props"
      v-on="$listeners"
      class="mr-1"
      :invalid-override="invalid"
      :tooltip="menuTooltip"
      :text="menuText"
      :style="firstHighlightStyle"
    ></ex-expression-menu>
    <path-segment
      v-bind="$props"
      :this-type="context"
      :index="0"
      :sub-settings="settings"
      :allow-computed="allowComputed"
      :allow-methods="allowMethods"
      @input="update"
      @remove="remove"
      @settings="onSettings"
    ></path-segment>
  </span>
</template>

<script lang="ts">
import { Expression, PathExpression, ColorType, ColorSpaceHSL, ColorSpaceRGB, NoExpression } from 'expangine-runtime';
import { TypeSettings } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';
import PathSegment from './PathSegment.vue';



export default ExpressionBase<PathExpression>().extend({
  name: 'PathEditor',
  components: {
    PathSegment,
  },
  props: {
    allowComputed: {
      type: Boolean,
      default: true,
    },
    allowMethods: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    first(): Expression {
      return this.value.expressions[0];
    },
    firstHighlighted(): boolean {
      return !!(this.highlight && this.highlight.has(this.first));
    },
    firstHighlightColor(): string {
      const DEFAULT_COLOR = '#BBDEFB';

      return this.showComplexity
        ? this.complexityColor
        : this.highlight
          ? this.highlight.get(this.first) || DEFAULT_COLOR
          : DEFAULT_COLOR;
    },
    firstHighlightStyle(): any {
      return this.firstHighlighted || this.showComplexity
        ? { 'box-shadow': '0 0 3px ' + this.firstHighlightShadowColor,
            'background-color': this.firstHighlightColor }
        : { };
    },
    firstHighlightShadowColor(): string {
      const color = ColorType.baseType.normalize(this.firstHighlightColor);
      if (!color) { 
        return this.firstHighlightColor;
      }
      const hsl = ColorSpaceHSL.fromColor(color);
      hsl.l -= 30;
      const rgb = ColorSpaceHSL.toColor(hsl);
      const formatted = ColorSpaceRGB.formatMap.hex.formatter(rgb);

      return formatted;
    },
    hasValue(): boolean {
      return !!this.first && this.first !== NoExpression.instance;
    },
    isSub(): boolean {
      return !!this.first && !this.first.isPathStart();
    },
    menuText(): string {
      return this.isSub ? 'Sub' : this.registry.getExpressionMenu(this.first);
    },
    menuTooltip(): string {
      return this.isSub ? 'A sub-value' : this.registry.getExpressionDescription(this.first);
    },
  },
  methods: {
    onSettings(settings: TypeSettings | null) {
      this.$emit('settings', settings);
    },
  },
});
</script>
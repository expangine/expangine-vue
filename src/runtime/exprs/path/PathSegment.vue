<template>
  <span class="path-segment ex-center-aligned">

    <v-tooltip top :disabled="!segmentRisky">
      <template #activator="{ on }">
        <ex-expression
          key="value"
          v-bind="$props"
          :class="segmentClass"
          :read-only="segmentReadOnly"
          :required-type="expectedType"
          :value="segment"
          :path-settings="subSettings"
          @input="updateSegment"
          @remove="removeSegment"
          @mouseenter.native="optionalListener(on.mouseenter, $event)"
          @mouseleave.native="optionalListener(on.mouseleave, $event)"
        ></ex-expression>
      </template>
      <span>This segment will most likely result in an undefined value.</span>
    </v-tooltip>

    <next-menu
      v-if="segmentType"
      :changes="1"
      :type="segmentType"
      :registry="registry"
      :context-details="contextDetails"
      :allow-computed="allowComputed"
      :allow-methods="allowMethods"
      :read-only="readOnly"
      @segment="changeSegment"
      @computed="changeComputed"
      @method="changeMethod"
    >
      <template #append>
        <v-list-item key="remove" @click="removeSegment">
          <v-list-item-content>
            <v-list-item-title>Remove</v-list-item-title>
            <v-list-item-subtitle>Remove this segment and everything after it</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </next-menu>

    <v-btn v-else icon>
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
    
    <path-segment 
      key="next"
      v-if="hasNext"
      v-bind="$props"
      v-on="$listeners"
      :this-type="segmentType"
      :index="nextIndex"
      :sub-settings="segmentValueSettings"
      :allow-computed="allowComputed"
      :allow-methods="allowMethods"
      @settings="onSettings"
    ></path-segment>

  </span>
</template>

<script lang="ts">
import { Type, TextType, Expression, ConstantExpression, isFunction, ComputedExpression, Exprs, PathExpression, MethodExpression, EntityType } from 'expangine-runtime';
import { TypeSubOption, TypeSettings, TypeComputedOption, TypeMethodOption } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';
import NextMenu from '@/app/NextMenu.vue';


export default ExpressionBase<PathExpression>().extend({
  name: 'PathSegment',
  components: {
    NextMenu,
  },
  props: {
    thisType: {
      type: Object as () => Type | null,
      default: (): Type | null => null,
    },
    index: {
      type: Number,
      required: true,
    },
    subSettings: {
      type: Object as () => TypeSettings<any, string> & TypeSettings<any, number>,
    },
    allowComputed: {
      type: Boolean,
      default: false,
    },
    allowMethods: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    nextIndex(): number {
      return this.index + 1;
    },
    hasNext(): boolean {
      return this.nextIndex < this.value.expressions.length;
    },
    segment(): Expression {
      return this.value.expressions[this.index];
    },
    segmentType(): Type | null {
      if (!this.thisType) {
        return null;
      }

      const node = this.segment;

      return this.index === 0 || node.isPathNode()
        ? node.getType(this.registry.defs, this.context, this.thisType)
        : this.thisType.getSubType(node, this.registry.defs, this.context);
    },
    dynamicOption(): TypeSubOption | null {
      return this.segment.isPathNode() 
        ? null
        : this.alternativeSegments.find((sub) => sub.key instanceof Type) || null;
    },
    segmentOption(): TypeSubOption | null {
      return this.alternativeSegments.find((sub) => {
        if (this.segment instanceof ConstantExpression 
          && this.segment.value === sub.key) {
          return true;
        }
        if (sub.key instanceof Type 
          && this.segmentType 
          && sub.key.acceptsType(this.segmentType)) {
          return true;
        }

        return false;
      }) || this.dynamicOption;
    },
    segmentSettings(): TypeSettings | null {
      return this.getSettings(true);
    },
    segmentValueSettings(): TypeSettings | null {
      return this.getSettings(false);
    },
    segmentRisky(): boolean {
      if (this.index === 0) {
        return false;
      }
      if (this.segment.isPathNode()) {
        return false;
      }
      if (!this.segmentOption) {
        return true;
      }
      if (this.segmentOption.key instanceof TextType && this.segment instanceof ConstantExpression) {
        return true;
      }

      return false;
    },
    segmentClass(): any {
      return { 
        'ex-parenthesis': this.hasParenthesis,
        'ex-inside ex-brackets': this.hasBrackets,
        'risky': this.segmentRisky,
      };
    },
    hasBrackets(): boolean {
      return !this.segment.isPathNode() && (!this.segmentOption || !!this.expectedType) && this.index > 0;
    },
    hasParenthesis(): boolean {
      return this.index === 0 && !this.segment.isPathStart();
    },
    expectedType(): Type | null {
      return this.segmentOption && this.segmentOption.key instanceof Type
        ? this.segmentOption.key
        : null;
    },
    segmentReadOnly(): boolean {
      return this.readOnly || (!this.expectedType && !this.segment.isPathNode() && this.index > 0);
    },
    alternativeSegments(): TypeSubOption[] {
      if (this.index === 0) {
        return [];
      }

      const segments = this.thisType
        ? this.registry.getTypeSubOptions(this.thisType)
        : [];
      
      const sorted = segments.slice();

      sorted.sort((a, b) => {
        const ad = a.key instanceof Type ? 1 : 0;
        const bd = b.key instanceof Type ? 1 : 0;

        return ad - bd;
      });

      return sorted;
    },
  },
  watch: {
    segmentValueSettings: {
      immediate: true,
      handler(settings: TypeSettings | null) {
        if (!this.hasNext) {
          this.onSettings(settings);
        }
      },
    },
  },
  methods: {
    getSettings(forKey: boolean): TypeSettings | null {
      return this.segmentType && this.subSettings && this.segmentOption
        ? this.registry.getTypeSubSettings(this.segmentType, this.subSettings, this.segmentOption, forKey)
        : null;
    },
    onSettings(settings: TypeSettings | null) {
      this.$emit('settings', settings);
    },
    updateSegment(segment: Expression) {
      this.$set(this.value.expressions, this.index, segment);
      this.update();
    },
    changeSegment(sub: TypeSubOption) {
      let segment: Expression;
      if (sub.key instanceof Type) {
        const visual = this.registry.getTypeVisuals(sub.key);
        segment = Exprs.const(visual.type.baseType.create());
      } else {
        segment = Exprs.const(sub.key);
      }
      
      this.value.expressions.splice(this.nextIndex, this.value.expressions.length - this.nextIndex, segment);
      this.update();
    },
    changeComputed(sub: TypeComputedOption) {
      this.value.expressions.splice(this.nextIndex, this.value.expressions.length - this.nextIndex, new ComputedExpression(sub.value.id));
      this.update();
    },
    changeMethod(sub: TypeMethodOption) {
      const segmentType = this.segmentType;

      if (segmentType instanceof EntityType) {
        this.value.expressions.splice(this.nextIndex, this.value.expressions.length - this.nextIndex, new MethodExpression(segmentType.options as string, sub.value.name, {}));
        this.update();
      }
    },
    removeSegment() {
      this.value.expressions.splice(this.nextIndex, this.value.expressions.length - this.nextIndex);
      this.update();
    },
    optionalListener(callback: any, $event: any) {
      if (isFunction(callback)) {
        callback($event);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.path-segment {
  position: relative;
}
</style>
<template>
  <span class="path-segment">

    <v-menu key="menu" max-height="400" offset-y>
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>
      <v-list two-line>
        <template v-for="(alt, index) in alternativeSegments">
          <v-list-item :key="index" @click="changeSegment(alt)">
            <v-list-item-content>
              <v-list-item-title>
                {{ alt.text }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ alt.description }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="contextDetails[alt.text]">
                {{ contextDetails[alt.text] }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item key="remove" @click="removeSegment">
          <v-list-item-content>
            <v-list-item-title>Remove</v-list-item-title>
            <v-list-item-subtitle>Remove this segment and everything after it</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    
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

    <path-segment 
      key="next"
      v-if="hasNext"
      v-bind="$props"
      v-on="$listeners"
      :index="index + 1"
      :path="path"
      :sub-settings="segmentValueSettings"
      @settings="onSettings"
    ></path-segment>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TextType, Expression, ExpressionBuilder, ConstantExpression, isFunction } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { TypeSubOption, TypeSettings } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';


const ex = new ExpressionBuilder();

export default ExpressionBase().extend({
  name: 'PathSegment',
  props: {
    path: {
      type: Array as () => Expression[],
      required: true,
    },
    root: {
      type: Object as () => Type | null,
      default: null,
    },
    index: {
      type: Number,
      required: true,
    },
    subSettings: {
      type: Object as () => TypeSettings<any, string> & TypeSettings<any, number>,
    },
  },
  computed: {
    noop: () => (() => undefined),
    rootType(): Type {
      return this.root || this.context;
    },
    hasNext(): boolean {
      return this.index + 1 < this.path.length;
    },
    segment(): Expression {
      return this.path[this.index];
    },
    segmentType(): Type | null {
      return Type.simplify(this.segment.getType(this.registry.defs, this.rootType));
    },
    dynamicOption(): TypeSubOption | null {
      return this.alternativeSegments.find((sub) => sub.key instanceof Type) || null;
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
      return !this.segmentOption || (this.segmentOption.key instanceof TextType && this.segment instanceof ConstantExpression);
    },
    segmentClass(): any {
      return { 
        'expression-inside brackets': this.hasBrackets,
        'risky': this.segmentRisky,
      };
    },
    hasBrackets(): boolean {
      return !this.segmentOption || !!this.expectedType;
    },
    expectedType(): Type | null {
      return this.segmentOption && this.segmentOption.key instanceof Type
        ? this.segmentOption.key
        : null;
    },
    segmentReadOnly(): boolean {
      return this.readOnly || !this.expectedType;
    },
    previousType(): Type | null {
      return this.registry.defs.getPathType(this.path, this.rootType, this.index);
    },
    alternativeSegments(): TypeSubOption[] {
      const segments = this.index === 0
        ? this.registry.getTypeSubOptions(this.rootType)
        : this.previousType
          ? this.registry.getTypeSubOptions(this.previousType)
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
      return this.previousType && this.subSettings && this.segmentOption
        ? this.registry.getTypeSubSettings(this.previousType, this.subSettings, this.segmentOption, forKey)
        : null;
    },
    onSettings(settings: TypeSettings | null) {
      this.$emit('settings', settings);
    },
    updateSegment(segment: Expression) {
      this.$set(this.path, this.index, segment);
      this.update();
    },
    changeSegment(sub: TypeSubOption) {
      let segment: Expression;
      if (sub.key instanceof Type) {
        const visual = this.registry.getTypeVisuals(sub.key);
        segment = ex.const(visual.type.baseType.create());
      } else {
        segment = ex.const(sub.key);
      }
      
      this.path.splice(this.index, this.path.length - this.index, segment);
      this.update();
    },
    removeSegment() {
      this.path.splice(this.index, this.path.length - this.index);
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
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
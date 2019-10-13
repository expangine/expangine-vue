<template>
  <span class="ex-path-segment">

    <v-menu key="menu" offset-y>
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>
      <v-list two-line dense>
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
      </v-list>
    </v-menu>
    
    <v-tooltip top :disabled="!segmentRisky">
      <template #activator="{ on }">
        <ex-expression
          key="value"
          v-bind="$props"
          type="value"
          :class="segmentClass"
          :read-only="segmentReadOnly"
          :required-type="expectedType"
          :value="segment"
          :path-settings="segmentSettings"
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
      :sub-settings="segmentSettings"
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
    hasNext(): boolean {
      return this.index + 1 < this.path.length;
    },
    segment(): Expression {
      return this.path[this.index];
    },
    segmentType(): Type | null {
      return Type.simplify(this.segment.getType(this.registry.defs, this.context));
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
      return this.segmentType && this.subSettings && this.segmentOption
        ? this.registry.getTypeSubSettings(this.segmentType, this.subSettings, this.segmentOption, true)
        : null;
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
      return this.registry.defs.getPathType(this.path, this.context, this.index);
    },
    alternativeSegments(): TypeSubOption[] {
      return this.index === 0
        ? this.registry.getTypeSubOptions(this.context)
        : this.previousType
          ? this.registry.getTypeSubOptions(this.previousType)
          : [];
    },
  },
  methods: {
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
.ex-path-segment {
  position: relative;
  // display: flex;
  // align-items: center;
  // flex-wrap: wrap;
}
</style>
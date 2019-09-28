<template>
  <span>
    <v-menu offset-y>
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="(alt, index) in alternativeSubs">
          <v-list-item :key="index" @click="changeAlternative(alt)">
            <v-list-item-content>
              <v-list-item-title>{{ alt.text }}</v-list-item-title>
              <v-list-item-subtitle>{{ alt.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
    <span v-if="expectedType">[ </span>
    <ex-expression
      v-bind="$props"
      v-on="$listeners"
      :read-only="segmentReadOnly"
      :required-type="expectedType"
      :value="segment"
      @input="updateSegment"
      @remove="removeSegment"
    ></ex-expression>
    <span v-if="expectedType"> ]</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TypeSub, GetExpression, Expression, ExpressionBuilder, ConstantExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '../../../common';
import { TypeSubOption } from '../../types/TypeVisuals';


const ex = new ExpressionBuilder();

export default ExpressionBase<GetExpression>().extend({
  name: 'GetSegment',
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    segment(): Expression {
      return this.value.path[this.index];
    },
    segmentType(): Type | null {
      return this.segment.getType(this.registry.defs, this.context);
    },
    expectedType(): Type | null {
      return this.currentOption && this.currentOption.key instanceof Type
        ? this.currentOption.key
        : null;
    },
    segmentReadOnly(): boolean {
      return this.readOnly || !this.expectedType;
    },
    previousType(): Type | null {
      return this.registry.defs.getPathType(this.value.path, this.context, this.index);
    },
    alternativeSubs(): TypeSubOption[] {
      return this.index === 0
        ? this.registry.getTypeSubOptions(this.context)
        : this.previousType
          ? this.registry.getTypeSubOptions(this.previousType)
          : [];
    },
    currentOption(): TypeSubOption | null {
      return this.alternativeSubs.find((sub) => {
        if (this.segment instanceof ConstantExpression 
          && this.segment.value === sub.key) {
          return true;
        }
        if (sub.key instanceof Type 
          && this.segmentType 
          && sub.key.isCompatible(this.segmentType.getSimplifiedType())) {
          return true;
        }

        return false;
      }) || null;
    },
  },
  methods: {
    updateSegment(segment: Expression) {
      window.console.log('update segment', segment);
      this.$emit('input', segment);
    },
    changeAlternative(sub: TypeSub) {
      window.console.log('change alternative', sub);

      let segment: Expression;
      if (sub.key instanceof Type) {
        const visual = this.registry.getTypeVisuals(sub.key);
        segment = ex.const(visual.type.baseType.create());
      } else {
        segment = ex.const(sub.key);
      }
      
      this.value.path.splice(this.index, this.value.path.length - this.index, segment);
      this.update();
    },
    removeSegment() {
      this.value.path.splice(this.index, this.value.path.length - this.index);
      this.update();
    },
  },
});
</script>
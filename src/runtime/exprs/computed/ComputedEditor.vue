<template>
  <div class="ex-center-aligned computed-editor">

    <ex-expression
      v-bind="$props"
      :value="value.expression"
      @input="setValue"
      @remove="clearValue"
      @input:root="onRootChange"
    ></ex-expression>

    <next-menu
      allow-computed
      :type="valueType"
      :registry="registry"
      :context-details="contextDetails"
      :read-only="readOnly"
      @segment="changeSegment"
      @computed="changeComputed"
    >
      <template #append v-if="!readOnly">
        <v-list-item key="remove" @click="onRemove">
          <v-list-item-content>
            <v-list-item-title>Remove</v-list-item-title>
            <v-list-item-subtitle>Remove this segment and everything after it</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </next-menu>

    <span>{{ name }}</span>

    <next-menu
      allow-computed
      :type="nextType"
      :registry="registry"
      :context-details="contextDetails"
      :hide="hideNext"
      :read-only="readOnly"
      @segment="addSegment"
      @computed="addComputed"
    ></next-menu>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, ExpressionBuilder, SubExpression, NoExpression, ComputedExpression, NullType, Exprs } from 'expangine-runtime';
import { TypeSubOption, TypeComputedOption } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';
import NextMenu from '@/app/NextMenu.vue';
import { getConfirmation } from '../../../app/Confirm';


export default ExpressionBase<ComputedExpression>().extend({
  name: 'ComputedEditor',
  components: {
    NextMenu,
  },
  computed: {
    name(): string {
      return this.value.name.split(':')[1] || this.value.name;
    },
    valueType(): Type {
      return this.value.expression.getType(this.registry.defs, this.context) || NullType.baseType;
    },
    nextType(): Type {
      return this.computedType || NullType.baseType;
    },
    hideNext(): boolean {
      return this.readOnly || !this.computedType || (this.value.parent && (
        this.value.parent instanceof SubExpression || 
        this.value.parent instanceof ComputedExpression
      ));
    },
  },
  methods: {
    onRemove() {
      const inner = this.value.expression;
      if (inner instanceof SubExpression && inner.path.length === 0) {
        this.input(inner.value);
      } else {
        this.input(inner);
      }
    },
    clearValue() {
      this.remove();
    },
    setValue(value: Expression) {
      const valueType = value.getType(this.registry.defs, this.context);
      const currentType = this.value.name.split(':')[0];

      if (valueType && valueType.getId() !== currentType) {
        this.input(value);
      } else {
        this.value.expression = value;
        this.update();
      }
    },
    addSegment(sub: TypeSubOption) {
      this.input(new SubExpression(this.value, [this.getSegmentExpression(sub)]));
    },
    changeSegment(sub: TypeSubOption) {
      this.input(new SubExpression(this.value.expression, [this.getSegmentExpression(sub)]));
    },
    addComputed(comp: TypeComputedOption) {
      this.input(new ComputedExpression(this.value, comp.value.id));
    },
    changeComputed(comp: TypeComputedOption) {
      this.value.name = comp.value.id;
      this.update();
    },
    getSegmentExpression(sub: TypeSubOption) {
      return sub.key instanceof Type
        ? Exprs.const(this.registry.getTypeVisuals(sub.key).type.baseType.create())
        : Exprs.const(sub.key);
    },
    onRootChange(input: Expression) {
      const parent = this.value.parent;
      if (parent instanceof SubExpression || parent instanceof ComputedExpression) {
        this.$emit('input:root', input);
      } else {
        this.input(input);
      }
    },
  },
});
</script>
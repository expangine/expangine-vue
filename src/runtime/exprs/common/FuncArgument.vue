<template>
  <span :class="classes">

    <v-chip 
      label 
      small
      outlined
      class="ma-1 pa-1" 
      :color="argColor"
      @click="toggle">
      {{ argLabel }}
    </v-chip>

    <span> = </span>

    <span v-if="hidden"
      class="ex-expression ex-parenthesis">
      <v-btn text @click="toggle">
        show
      </v-btn>
    </span>

    <ex-expression
      v-else
      v-bind="expressionProps"
      class="ex-parenthesis"
      :value="argExpression"
      :required-type="argType"
      @input="update"
      @remove="remove"
    ></ex-expression>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, Type, Func, ExpressionMap, NoExpression } from 'expangine-runtime';
import { Registry } from '../../Registry';


export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    func: {
      type: Object as () => Func,
    },
    args: {
      type: Object as () => ExpressionMap,
      required: true,
    },
    arg: {
      type: String,
      required: true,
    },
    expressionProps: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    hidden: false,
  }),
  computed: {
    argExpression(): Expression { 
      return this.args[this.arg] || NoExpression.instance;
    },
    argType(): Type | null {
      return this.func
        ? this.func.params.options.props[this.arg]
        : null;
    },
    extra(): boolean {
      return this.argType === null;
    },
    argLabel(): string {
      return this.extra ? `${this.arg} (extra)` : this.arg;
    },
    argColor(): string {
      return this.extra ? 'red' : '';
    },
    mutates(): boolean {
      return this.func
        ? this.func.mutates(this.registry.defs, this.arg)
        : false;
    },
    classes(): string {
      return this.mutates 
        ? 'param-span param-mutates' 
        : 'param-span';
    },
  },
  methods: {
    toggle() {
      this.hidden = !this.hidden;
    },
    update(expr: Expression) {
      this.$set(this.args, this.arg, expr || NoExpression.instance);
      this.$emit('update');
    },
    remove() {
      this.$delete(this.args, this.arg);
      this.$emit('update');
    },
  },
});
</script>

<style lang="less" scoped>
.param-span {
  display: inline-block;
  position: relative;

  > .param-label {
    position: absolute;
    top: -15px;
  }
}

.param-mutates {
  background-color: #FFB74D55;
}
</style>
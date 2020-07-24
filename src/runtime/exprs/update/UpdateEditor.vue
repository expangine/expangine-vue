<template>
  <div class="ex-center-aligned pl-3">

    <ex-expression-menu
      v-bind="$props"
      v-on="$listeners"
      class="mr-1"
      text="Update"
      tooltip="Update the variable to the given value"
    ></ex-expression-menu>

    <ex-path-editor
      v-bind="$props"
      v-on="$listeners"
      class="mx-3 ex-expression ex-parenthesis"
      :value="value.path"
      @input="setPath"
    ></ex-path-editor>

    <ex-chip-menu
      chip-class="mx-1"
      text="To"
      tooltip="The value to set the above variable to"
    ></ex-chip-menu>

    <ex-expression
      v-bind="$props"
      class="ml-3 ex-expression ex-parenthesis"
      :required-type="valueType"
      :value="value.value"
      :context="valueContext"
      @input="setValue"
      @remove="clearValue"
    ></ex-expression>

  </div>
</template>

<script lang="ts">
import { Type, NoExpression, Expression, UpdateExpression, Types, PathExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<UpdateExpression>().extend({
  name: 'UpdateEditor',
  computed: {
    valueType(): Type | null {
      return Types.simplify(this.value.path.getType(this.registry.defs, this.context));
    },
    valueContext(): Type {
      return this.valueType
        ? this.registry.defs.getContext(this.context, {
            [this.value.currentVariable]: this.valueType,
          })
        : this.context;
    },
  },
  methods: {
    clearValue() {
      this.value.value = NoExpression.instance;
      this.update();
    },
    setValue(value: Expression) {
      this.value.value = value;
      this.update();
    },
    setPath(path: PathExpression) {
      this.value.path = path;
      this.update();
    },
  },
});
</script>
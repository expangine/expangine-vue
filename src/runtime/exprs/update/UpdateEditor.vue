<template>
  <table v-if="multiline" class="ex-table">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu
            v-bind="$props"
            v-on="$listeners"
            text="Update"
            tooltip="Update the variable to the given value"
          ></ex-expression-menu>
        </td>
        <td>
          <ex-path-editor
            v-bind="$props"
            v-on="$listeners"
            :path="value.path"
          ></ex-path-editor>
        </td>
      </tr>
      <tr>
        <td>
          <ex-chip-menu
            text="To"
            tooltip="The value to set the above variable to"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            :required-type="valueType"
            :value="value.value"
            :context="valueContext"
            @input="setValue"
            @remove="clearValue"
          ></ex-expression>
        </td>
      </tr>
    </tbody>
  </table>
  <table v-else class="ex-table">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu
            v-bind="$props"
            v-on="$listeners"
            text="Update"
            tooltip="Update the variable to the given value"
          ></ex-expression-menu>
        </td>
        <td class="centered-cell">
          <span class="d-inline-block pr-3 my-3">
            <ex-path-editor
              v-bind="$props"
              v-on="$listeners"
              :path="value.path"
            ></ex-path-editor>
          </span>

          <span class="d-inline-block my-3">
            <ex-chip-menu
              class="my-3"
              text="To"
              tooltip="The value to set the above variable to"
            ></ex-chip-menu>
          </span>

          <span class="d-inline-block my-3">
            <ex-expression
              v-bind="$props"
              :required-type="valueType"
              :value="value.value"
              :context="valueContext"
              @input="setValue"
              @remove="clearValue"
            ></ex-expression>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, NoExpression, Expression, UpdateExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<UpdateExpression>().extend({
  name: 'UpdateEditor',
  computed: {
    valueType(): Type | null {
      return Type.simplify(this.registry.defs.getPathType(this.value.path, this.context));
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
  },
});
</script>

<style lang="less" scoped>
.centered-cell {
  display: flex;
  align-items: flex-start;
}
</style>
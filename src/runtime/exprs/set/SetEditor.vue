<template>
  <table v-if="multiline" class="expression-table">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu
            v-bind="$props"
            v-on="$listeners"
            text="Set"
            tooltip="Set the variable to the given value"
          ></ex-expression-menu>
        </td>
        <td>
          <ex-path-editor
            v-bind="$props"
            v-on="$listeners"
            :path="value.path"
            @settings="setValueSettings"
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
            type="value"
            :required-type="valueTypeSimplified"
            :value="value.value"
            :path-settings="valueSettings"
            @input="setValue"
            @remove="clearValue"
          ></ex-expression>
        </td>
      </tr>
    </tbody>
  </table>
  <table v-else class="expression-table">
     <tbody>
      <tr>
        <td>
          <ex-expression-menu
            v-bind="$props"
            v-on="$listeners"
            text="Set"
            tooltip="Set the variable to the given value"
          ></ex-expression-menu>
        </td>
        <td class="centered-cell">
          <span class="d-inline-block pr-3 my-3">
            <ex-path-editor
              v-bind="$props"
              v-on="$listeners"
              :path="value.path"
              @settings="setValueSettings"
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
              type="value"
              :required-type="valueTypeSimplified"
              :value="value.value"
              :path-settings="valueSettings"
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
import { Type, SetExpression, NoExpression, Expression } from 'expangine-runtime';
import { TypeSettings } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<SetExpression>().extend({
  name: 'SetEditor',
  data: () => ({
    valueSettings: null as null | TypeSettings,
  }),
  computed: {
    valueType(): Type | null {
      return this.registry.defs.getPathType(this.value.path, this.context);
    },
    valueTypeSimplified(): Type | null {
      return Type.simplify(this.valueType);
    },
  },
  methods: {
    setValueSettings(valueSettings: TypeSettings) {
      this.valueSettings = valueSettings;
    },
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
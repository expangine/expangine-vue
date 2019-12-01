<template>
  <div class="ex-center-aligned">

    <ex-expression-menu
      v-bind="$props"
      v-on="$listeners"
      text="Set"
      tooltip="Set the variable to the given value"
    ></ex-expression-menu>

    <ex-path-editor
      v-bind="$props"
      v-on="$listeners"
      class="mr-3"
      :path="value.path"
      @settings="setValueSettings"
    ></ex-path-editor>

    <ex-chip-menu
      text="To"
      tooltip="The value to set the above variable to"
    ></ex-chip-menu>

    <ex-expression
      v-bind="$props"
      class="ml-3"
      :required-type="valueTypeSimplified"
      :value="value.value"
      :path-settings="valueSettings"
      @input="setValue"
      @remove="clearValue"
    ></ex-expression>

  </div>
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
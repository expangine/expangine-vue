<template>
  <span class="ex-center-aligned">

    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Invoke"
      tooltip="Execute a user-defined function"
    >
      <template #prepend>
        <v-list-item @click="test">
          <v-list-item-content>
            <v-list-item-title>
              Test
            </v-list-item-title>
            <v-list-item-subtitle>
              Test this function out
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="edit">
          <v-list-item-content>
            <v-list-item-title>
              Edit
            </v-list-item-title>
            <v-list-item-subtitle>
              Edit this function
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </ex-expression-menu>

    <span v-if="readOnly" class="ml-3">{{ value.name }}</span>

    <v-autocomplete
      v-else
      outlined
      dense
      hide-details
      class="function-select d-inline-block mx-2"
      :items="functions"
      v-model="value.name"
      v-focus-on-create="'input'"
      @change="update"
    ></v-autocomplete>

    <span v-if="func" class="function-args ex-expression ex-parenthesis">
      <template v-for="(paramType, param) in paramTypes">
        <span :key="param" class="param-span">

          <v-chip label outlined @click="toggleParameter(param)">
            {{ param }}
          </v-chip>

          <span> = </span>

          <span v-if="hiddenParameter(param)"
            class="ex-expression ex-parenthesis">
            <v-btn text @click="toggleParameter(param)">
              show
            </v-btn>
          </span>

          <ex-expression
            v-else
            v-bind="$props"
            class="ex-parenthesis"
            :value="getParam(param)"
            :required-type="paramType"
            @input="setParam(param, $event)"
            @remove="setParam(param)"
          ></ex-expression>

        </span>
      </template>
      <template v-for="(argExpr, arg) in value.args">
        <span :key="arg" v-if="isExtraArgument(arg)" class="param-span">

          <v-chip 
            x-small 
            label 
            outlined 
            class="param-label" 
            color="red"
            @click="toggleParameter(arg)"
          >
            {{ arg }} (extra)
          </v-chip>

          <span v-if="hiddenParameter(arg)"
            class="ex-expression ex-parenthesis">
            <v-btn text @click="toggleParameter(arg)">
              show
            </v-btn>
          </span>

          <ex-expression
            v-else
            v-bind="$props"
            class="ex-parenthesis"
            :value="argExpr"
            :required-type="null"
            @input="setParam(arg, $event)"
            @remove="removeParam(arg)"
          ></ex-expression>

        </span>
      </template>
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { TypeMap, Expression, ChainExpression, InvokeExpression, ExpressionBuilder, NoExpression, FunctionType, objectValues } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '../../../common';
import { getTestFunction } from '../../../app/TestFunction';
import { getEditFunction } from '../../../app/EditFunction';


export default ExpressionBase<InvokeExpression>().extend({
  name: 'InvokeEditor',
  data: () => ({
    hiddenParams: {} as Record<string, boolean>,
  }),
  computed: {
    functions(): ListOptions<string> {
      return objectValues(this.registry.defs.functions, (f, name) => ({
        text: name,
        description: 'Returns ' + this.registry.getTypeDescribeLong(f.options.returnType, '', ' '),
        value: name,
      }));
    },
    func(): FunctionType | null {
      return this.registry.defs.getFunction(this.value.name) || null;
    },
    paramTypes(): TypeMap {
      return this.func
        ? this.func.options.params.options.props
        : {};
    },
  },
  methods: {
    toggleParameter(name: string) {
      if (name in this.hiddenParams) {
        this.$delete(this.hiddenParams, name);
      } else {
        this.$set(this.hiddenParams, name, true);
      }
    },
    hiddenParameter(name: string) {
      return !!this.hiddenParams[name];
    },
    isExtraArgument(name: string) {
      return !this.paramTypes[name];
    },
    getParam(param: string) {
      return this.value.args[param] || NoExpression.instance;
    },
    setParam(param: string, expr?: Expression) {
      this.$set(this.value.args, param, expr || NoExpression.instance);
      this.update();
    },
    removeParam(param: string) {
      this.$delete(this.value.args, param);
      this.update();
    },
    test() {
      const registry = this.registry;
      const name = this.value.name;

      getTestFunction({ registry, name });
    },
    edit() {
      const registry = this.registry;
      const name = this.value.name;

      getEditFunction({ registry, name });
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

.function-args {
  flex: 0 1 200px;
  min-width: fit-content;
}
</style>
<template>
  <span class="invoke-editor pl-3">
    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Invoke"
      tooltip="Execute a user-defined function"
    ></ex-expression-menu>
    <v-select
      outlined
      dense
      hide-details
      class="d-inline-block mx-2"
      label="Function"
      :items="functions"
      v-model="value.name"
      @change="update"
    ></v-select>
    <template v-if="func">
      <template v-for="(paramType, param) in paramTypes">
        <span :key="param" class="param-span">

          <v-chip 
            x-small 
            label 
            outlined 
            class="param-label" 
            @click="toggleParameter(param)"
          >
            {{ param }}
          </v-chip>

          <span v-if="hiddenParameter(param)"
            class="ex-expression parenthesis">
            <v-btn text @click="toggleParameter(param)">
              show
            </v-btn>
          </span>

          <ex-expression
            v-else
            v-bind="$props"
            class="parenthesis"
            type="value"
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
            class="ex-expression parenthesis">
            <v-btn text @click="toggleParameter(arg)">
              show
            </v-btn>
          </span>

          <ex-expression
            v-else
            v-bind="$props"
            class="parenthesis"
            type="value"
            :value="argExpr"
            :required-type="null"
            @input="setParam(arg, $event)"
            @remove="setParam(arg)"
          ></ex-expression>

        </span>
      </template>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { TypeMap, Expression, ChainExpression, InvokeExpression, ExpressionBuilder, NoExpression, FunctionType, objectValues } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '../../../common';


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

.invoke-editor {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
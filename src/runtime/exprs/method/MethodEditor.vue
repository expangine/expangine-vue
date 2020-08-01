<template>
  <span class="ex-center-aligned">

    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Method"
      tooltip="Execute a method on a type"
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

    <span class="ml-3">{{ value.name }}</span>

    <span v-if="func" class="function-args ex-expression ex-parenthesis">
      <template v-for="(paramType, param) in paramTypes">
        <ex-func-argument
          :key="param"
          :registry="registry"
          :func="func"
          :arg="param"
          :args="value.args"
          :expression-props="$props"
          @update="update"
        ></ex-func-argument>
      </template>
      <template v-for="(argExpr, arg) in value.args">
        <ex-func-argument
          v-if="isExtraArgument(arg)"
          :key="arg"
          :registry="registry"
          :func="func"
          :arg="param"
          :args="value.args"
          :expression-props="$props"
          @update="update"
        ></ex-func-argument>
      </template>
    </span>
  </span>
</template>

<script lang="ts">
import { TypeMap, Expression, MethodExpression, NoExpression, Func, Entity } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { getTestFunction } from '../../../app/TestFunction';
import { getEditFunction } from '../../../app/EditFunction';


export default ExpressionBase<MethodExpression>().extend({
  name: 'MethodEditor',
  data: () => ({
    hiddenParams: {} as Record<string, boolean>,
  }),
  computed: {
    entity(): Entity | null {
      return this.registry.defs.getEntity(this.value.entity);
    },
    func(): Func | null {
      return this.entity 
        ? this.entity.methods[this.value.name]
        : null;
    },
    paramTypes(): TypeMap {
      return this.func
        ? this.func.params.options.props
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
.function-args {
  flex: 0 1 200px;
  min-width: fit-content;
}
</style>
<template>
  <span v-if="hasParameter" :class="classes">

    <v-tooltip top v-if="!readOnly">
      <template #activator="{ on }">
        <v-chip x-small label class="param-label" v-on="on" @click="toggleHidden">
          {{ name }}
        </v-chip>
      </template>
      <span>
        {{ comments }}
        <span v-if="mutatesParameter">
          <br><br>This operation changes this value
        </span>  
      </span>
    </v-tooltip>

    <span v-if="hidden" class="ex-expression ex-parenthesis">
      <v-btn text @click="toggleHidden">
        show
      </v-btn>
    </span>
    <ex-expression
      v-else
      v-bind="expressionProps"
      class="ex-parenthesis"
      :value="paramExpression"
      :context="context"
      :context-details="contextDetails"
      :required-type="requiredType"
      @input="setParam"
      @remove="removeParam"
    ></ex-expression>

  </span>

  <span v-else-if="!readOnly" class="param-span">
    <v-btn text @click="addParam">
      {{ defaultValue }}
    </v-btn>
  </span>

  <span v-else class="param-span">
    {{ defaultValue }}
  </span>

</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, OperationExpression, Operation, OperationTypes, NoExpression } from 'expangine-runtime';
import { OperationVisuals } from '../../ops/OperationVisuals';


export default Vue.extend({
  name: 'OperationParam',
  props: {
    expressionProps: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    requiredType: {
      type: Object as () => Type | null,
      default: null,
    },
    value: {
      type: Object as () => OperationExpression,
      required: true,
    },
    context: {
      type: Object as () => Type,
      required: true,
    },
    contextDetails: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    operation: {
      type: Object as () => Operation,
      required: true,
    },
    operationTypes: {
      type: Object as () => OperationTypes<any, any, any>,
      required: true,
    },
    operationVisuals: {
      type: Object as () => OperationVisuals,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hidden: false,
  }),
  computed: {
    classes(): string {
      return this.mutatesParameter
        ? 'param-span param-mutates'
        : 'param-span';
    },
    comments(): string {
      return this.operationVisuals.comments[this.name];
    },
    defaultValue(): string {
      return this.operationVisuals.defaults[this.name] || this.name;
    },
    hasParameter(): boolean {
      return !!this.value.params[this.name];
    },
    paramExpression(): Expression {
      return this.value.params[this.name];
    },
    mutatesParameter(): boolean {
      return this.operation 
        ? this.operation.mutates.indexOf(this.name) !== -1
        : false;
    },
  },
  methods: {
    toggleHidden() {
      this.hidden = !this.hidden;
    },
    addParam() {
      this.setParam(NoExpression.instance);
    },
    removeParam() {
      this.setParam();
    },
    setParam(expr?: Expression) {
      if (this.operationTypes.optional[this.name] && !expr) {
        this.$delete(this.value.params, this.name);
      } else {
        this.$set(this.value.params, this.name, expr || NoExpression.instance);
      }
      this.update();
    },
    update() {
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
    background-color: white !important;
    outline: 1px solid rgba(0,0,0,0.1);
    display: none;

    &:hover {
      display: block;
    }
  }

  &:hover {
    > .param-label {
      display: block;
    }
  }
}

.param-mutates {
  background-color: #FFB74D55;
}
</style>
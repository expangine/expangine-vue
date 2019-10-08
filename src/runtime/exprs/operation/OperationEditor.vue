<template>
  <span v-if="returnTypeMode">
    <v-autocomplete
      hide-details
      outlined
      append-icon="mdi-close"  
      :label="returnTypeDescribed"
      :items="returnTypeOperations"
      @input="chooseOperation"
      @click:append="cancel"
    ></v-autocomplete>
  </span>
  <span v-else-if="forTypeMode">
    <v-autocomplete
      hide-details
      outlined
      clearable
      append-icon="mdi-close"  
      :label="forTypeDescribed"
      :items="forTypeOperations"
      @input="chooseOperation"
      @click:append="cancel"
    ></v-autocomplete>
  </span>
  <span v-else-if="isEmpty">
    <v-autocomplete
      hide-details
      outlined
      clearable
      label="Operation"
      append-icon="mdi-close"  
      :items="allOperations"
      @input="chooseOperation"
      @click:append="cancel"
    ></v-autocomplete>
  </span>
  <span v-else>
    <table class="expression-table">
      <tbody>
        <tr>
          <td>
            <ex-expression-menu
              v-bind="$props"
              v-on="$listeners"
              text="Op"
              tooltip="Perform an operation"
            ></ex-expression-menu>
          </td>
          <td>
            <ex-templated :template="operationDescription">
              <template #section="{ name }">
                <v-menu :close-on-content-click="false">
                  <template #activator="{ on }">
                    <v-btn x-small rounded color="secondary" v-on="on">
                      {{ name }}
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <strong>{{ operationVisuals.comments[name] }}</strong>
                      <v-sheet elevation="2" class="pa-2 ma-2">
                        <ex-expression
                          v-bind="$props"
                          type="value"
                          :value="value.params[name]"
                          :context="paramContext(name)"
                          :required-type="paramTypes[name]"
                          @input="setParam(name, $event)"
                          @remove="setParam(name)"
                        ></ex-expression>
                      </v-sheet>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </ex-templated>
          </td>
        </tr>
      </tbody>
      <template v-for="(param, name) in value.params">
        <tbody :key="name">
          <tr>
            <td>
              <ex-chip-menu
                :text="name"
                :tooltip="operationVisuals.comments[name] || ''"
              ></ex-chip-menu>
            </td>
            <td>
              <ex-expression
                v-bind="$props"
                type="value"
                :value="param"
                :context="paramContext(name)"
                :required-type="paramTypes[name]"
                @input="setParam(name, $event)"
                @remove="setParam(name)"
              ></ex-expression>
            </td>
          </tr>
        </tbody>
      </template>
    </table>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, Type, TypeMap, OperationExpression, OperationPair, NoExpression, Operation, OperationTypes } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '@/common';
import { OperationVisuals } from '../../ops/OperationVisuals';


const STARTING_PARAM = '$wrapped';

export default ExpressionBase<OperationExpression>().extend({
  name: 'OperationEditor',
  computed: {
    isEmpty(): boolean {
      return !this.value.name;
    },
    operation(): Operation<any, any, any, any, any> | null {
      return this.registry.defs.getOperation(this.value.name);
    },
    operationTypes(): OperationTypes<any, any, any> | null {
      return this.registry.defs.getOperationTypes(this.value.name);
    },
    operationVisuals(): OperationVisuals {
      return this.registry.getOperationVisuals(this.value.name);
    },
    operationDescription(): string {
      return this.operationVisuals.description;
    },
    paramTypes(): TypeMap {
      return this.registry.defs.getOperationExpectedTypes(this.value.name, this.value.params, this.value.scopeAlias, this.context);
    },
    startingValue(): Expression | null {
      return this.value.params[STARTING_PARAM] || null;
    },
    startingValueType(): Type | null {
      return this.startingValue
        ? Type.simplify(this.startingValue.getType(this.registry.defs, this.context))
        : null;
    },
    hasStartingValue(): boolean {
      return !!this.startingValue;
    },
    returnTypeDescribed(): string {
      return this.requiredType
        ? 'Operation for ' + this.registry.getTypeDescribe(this.requiredType)
        : 'Operation';
    },
    returnTypeMode(): boolean {
      return !!this.requiredType && this.isEmpty && !this.hasStartingValue;
    },
    returnTypeOperations(): ListOptions<OperationPair> {
      return this.requiredType
        ? this.registry.defs
          .getOperationsWithReturnType(this.requiredType)
          .map(this.getListOption)
        : [];
    },
    forTypeMode(): boolean {
      return this.isEmpty && this.hasStartingValue;
    },
    forTypeDescribed(): string {
      return this.startingValueType
        ? 'Operation for ' + this.registry.getTypeDescribe(this.startingValueType)
        : 'Operation';
    },
    forTypeOperations(): ListOptions<OperationPair> {
      return this.startingValueType
        ? this.registry.defs
          .getOperationsForType(this.startingValueType)
          .map(this.getListOption)
        : [];
    },
    allOperations(): ListOptions<OperationPair> {
      return this.registry.defs.getOperations()
        .map(this.getListOption);
    },
  },
  methods: {
    cancel() {
      if (this.startingValue) {
        this.input(this.startingValue);
      } else {
        this.remove();
      }
    },
    getListOption(value: OperationPair) {
      const { name: text, description } = this.registry.getOperationVisuals(value.op.id);

      return { 
        text,
        description,
        value,
      };
    },
    paramContext(name: string): Type {
      const defs = this.registry.defs;
      const op = this.operation;
      const opTypes = this.operationTypes;

      if (op && opTypes && op.hasScope.indexOf(name) !== -1) 
      {
          const { context, scope } = defs.getContextWithScope(this.context);

          for (const scopeParam of op.scope) 
          {
            const scopeType = defs.getOperationInputType(opTypes.scope[scopeParam], this.paramTypes);

            if (scopeType) 
            {
              const alias = this.value.scopeAlias[scopeParam] || scopeParam;

              scope[alias] = scopeType.getSimplifiedType();
            }
          }

          return context;
      }

      return this.context;
    },
    chooseOperation(pair: OperationPair) {
      const startingValue = this.startingValue;
      const params = this.value.params;

      this.value.name = pair.op.id;

      if (startingValue) {
        const startName = pair.op.params[0];
        this.$set(params, startName, startingValue);
        this.$delete(params, STARTING_PARAM);
      }

      for (const param of pair.op.params) {
        if (!params[param]) {
          this.$set(params, param, NoExpression.instance);
        }
      }

      this.update();
    },
    setParam(name: string, expr?: Expression) {
      this.$set(this.value.params, name, expr || NoExpression.instance);
      this.update();
    },
  },
});
</script>
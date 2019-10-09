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
  <table v-else class="expression-table">
    <tbody>
      <tr>
        <td :class="inOperationClass">
          <ex-expression-menu
            v-if="!readOnly"
            v-bind="$props"
            v-on="$listeners"
            class="mr-3"
            text="Op"
            :tooltip="operationName">
            <template #prepend>

              <v-menu offset-x open-on-hover style="display: inline" v-if="hasScope">
                <template #activator="{ on }">
                  <v-list-item v-on="on">
                    <v-list-item-content>
                      <v-list-item-title>
                        Operation Scope
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Change the name of the scoped variables
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-avatar>
                      <v-icon>mdi-menu-right</v-icon>
                    </v-list-item-avatar>
                  </v-list-item>
                </template>
                <v-list>
                  <template v-for="scopeParam in operation.scope">
                    <v-list-item :key="scopeParam" @click="changeScope(scopeParam)">
                      <v-list-item-content>
                        <v-list-item-title>{{ value.scopeAlias[scopeParam] || scopeParam }}</v-list-item-title>
                        <v-list-item-subtitle>{{ scopeParam }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
              
              <v-dialog style="display: inline" width="500">
                <template #activator="{ on }">
                  <v-list-item v-on="on">
                    <v-list-item-content>
                      <v-list-item-title>
                        Inspect
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Look into the details of this operation
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                    {{ operationName }}
                  </v-card-title>
                   <v-card-text>
                     Hello World!
                   </v-card-text>
                </v-card>
              </v-dialog>

            </template>
          </ex-expression-menu>
        </td>
        <td v-if="showSingleLine">
          <ex-templated :template="operationVisuals.singleline" :text-style="{marginTop: '15px'}" class="ex-operation">
            <template #section="{ section }">
              <span v-if="hasParameter(section)" class="param-span">

                <v-tooltip top v-if="!readOnly">
                  <template #activator="{ on }">
                    <v-chip x-small label outlined class="param-label" v-on="on">
                      {{ section }}
                    </v-chip>
                  </template>
                  <span>{{ operationVisuals.comments[section] }}</span>
                </v-tooltip>

                <span class="param-group">

                  <ex-symbol class="param-group-end" key="start" type="("></ex-symbol>

                  <ex-expression
                    key="value"
                    class="param-group-middle"
                    v-bind="$props"
                    type="value"
                    :value="value.params[section]"
                    :context="paramContext(section)"
                    :context-details="paramContextDetails(section)"
                    :required-type="paramTypes[section]"
                    @input="setParam(section, $event)"
                    @remove="setParam(section)"
                  ></ex-expression>

                  <ex-symbol class="param-group-end" key="end" type=")"></ex-symbol>

                </span>

              </span>

              <span v-else class="param-span">
                <v-btn text @click="resetParam(section)">
                  {{ operationVisuals.defaults[section] || section }}
                </v-btn>
              </span>

            </template>
          </ex-templated>
        </td>
        <td v-else>
          <ex-templated :template="operationVisuals.singleline" :text-style="{marginTop: '15px'}">
            <template #section="{ section }">
              <span v-if="hasParameter(section)">
                <strong>{{ section }}</strong>
              </span>
              <span v-else class="param-span">
                <v-btn text @click="resetParam(section)">
                  {{ operationVisuals.defaults[section] || section }}
                </v-btn>
              </span>
            </template>
          </ex-templated>
        </td>
      </tr>
    </tbody>
    <template v-if="!showSingleLine">
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
                :context-details="paramContextDetails(name)"
                :required-type="paramTypes[name]"
                @input="setParam(name, $event)"
                @remove="setParam(name)"
              ></ex-expression>
            </td>
          </tr>
        </tbody>
      </template>
    </template>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, Type, TypeMap, OperationExpression, OperationPair, NoExpression, Operation, OperationTypes, Traverser, GetExpression, ConstantExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '@/common';
import { OperationVisuals } from '../../ops/OperationVisuals';
import { getInput } from '../../../app/Input';
import { sendNotification } from '../../../app/Notify';


// TODO Change Operation: registry.defs.getOperationsWithMapping (this.operation.name, this.paramTypes)

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
    operationName(): string {
      return this.operationVisuals.name;
    },
    operationDescription(): string {
      return this.operationVisuals.description;
    },
    hasScope(): boolean {
      return this.operation ? this.operation.scope.length > 0 : false;
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
    showSingleLine(): boolean {
      return !!(!this.multiline 
        && this.operationVisuals
        && this.operationVisuals.singleline);
    },
  },
  methods: {
    hasParameter(name: string): boolean {
      return !!this.value.params[name];
    },
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
    paramContextDetails(name: string): Record<string, string> {
      const defs = this.registry.defs;
      const op = this.operation;
      const opTypes = this.operationTypes;
      const opVisuals = this.operationVisuals;
      let details = this.contextDetails;

      if (op && opTypes && op.hasScope.indexOf(name) !== -1) 
      {
        details = { ...details };
        
        for (const scopeParam of op.scope)
        {
          const alias = this.value.scopeAlias[scopeParam] || scopeParam;

          details[alias] = opVisuals.scopeComments[scopeParam];
        }
      }

      return details;
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
    resetParam(name: string) {
      this.setParam(name, NoExpression.instance);
    },
    setParam(name: string, expr?: Expression) {
      if (this.operationTypes && this.operationTypes.optional[name] && !expr) {
        this.$delete(this.value.params, name);
      } else {
        this.$set(this.value.params, name, expr || NoExpression.instance);
      }
      this.update();
    },
    async changeScope(scopeParam: string) {
      const previous = this.value.scopeAlias[scopeParam] || scopeParam;
      const alias = await getInput({ 
        message: 'Enter a new variable name',
        value: previous,
        label: scopeParam,
      });

      if (alias) {
        if (this.hasContextVar(alias)) {
          await sendNotification({ message: 'That variable name is already taken' });
        } else if (previous === alias) {
          await sendNotification({ message: 'No variable name change' });
        } else {
          this.$set(this.value.scopeAlias, scopeParam, alias);

          this.value.traverse(new Traverser((expr) => {
            if (expr instanceof GetExpression) { 
              const first = expr.path[0];
              if (first instanceof ConstantExpression) {
                if (first.value === previous) {
                  first.value = alias;
                }
              }
            }
          }));

          this.update();

          await sendNotification({ message: `Variable changed from "${previous}" to "${alias}"` });
        }
      }
    },
  },
});
</script>

<style lang="less" scoped>
.param-span {
  display: inline-block;
  margin-top: 15px;
  position: relative;

  > .param-label {
    position: absolute;
    top: -15px;
  }
}

.param-group {
  display: flex;

  > .param-group-end {
    flex: 0 0 10px;
  }

  > .param-group-middle {
    flex: 1 0;
  }
}

.ex-operation {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
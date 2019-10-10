<template>
  <span v-if="isEmpty">
    <v-autocomplete
      hide-details
      outlined
      clearable
      append-icon="mdi-close"
      :menu-props="{maxWidth: 400}"
      :label="searchLabel"
      :items="searchItems"
      :filter="filterOperation"
      @input="chooseOperation"
      @click:append="cancel">
      <template #item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-html="item.text"></v-list-item-title>
          <v-list-item-subtitle v-html="item.description"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
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
              
              <v-list-item @click="inspecting = true">
                <v-list-item-content>
                  <v-list-item-title>
                    Inspect
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Look into the details of this operation
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-menu offset-x open-on-hover class="d-inline" v-if="hasScope">
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

            </template>
          </ex-expression-menu>

          <v-dialog v-model="inspecting" width="1000">
            <v-card>
              <v-card-text>

                <p class="display-1 text--primary pa-2 pt-4">
                  {{ operationName }}  

                  <v-chip class="float-right mt-2" :color="operationComplexityColor">
                    Complexity: {{ operationComplexity }}
                  </v-chip>
                </p>
                
                <v-sheet class="text--primary pa-3 mb-3" elevation="2">
                  {{ operationDescription }}
                </v-sheet>

                <v-simple-table class="fixed-table">
                  <colgroup>
                    <col style="width: 100px">
                    <col style="width: 30%;">
                    <col style="width: 30%;">
                    <col style="width: 40%;">
                    <col style="width: 80px">
                    <col style="width: 100px">
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Expected Type</th>
                      <th>Current Type</th>
                      <th>Comment</th>
                      <th>Mutates</th>
                      <th>Has Scope?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="param in operation.params">
                      <tr :key="param">
                        <td class="nowrap" :title="param">
                          {{ param }} 
                          <span class="red--text text--darken-4">*</span>
                        </td>
                        <td>
                          <code class="d-block pa-2" 
                            v-html="describeType(paramTypes[param])"
                          ></code>
                        </td>
                        <td class="scrollable">
                          <code class="d-block pa-2" 
                            v-if="value.params[param]"
                            v-html="describeType(paramActual(param))"
                          ></code>
                        </td>
                        <td class="scrollable">
                          {{ operationVisuals.comments[param] }}
                        </td>
                        <td class="text-center">
                          <div v-if="operation.mutates.indexOf(param) + 1">
                            Yes
                          </div>
                        </td>
                        <td class="text-center">
                          <div v-if="operation.hasScope.indexOf(param) + 1">
                            Yes
                          </div>
                        </td>
                      </tr>
                    </template>
                    <template v-for="param in operation.optional">
                      <tr :key="param">
                        <td class="nowrap" :title="param">
                          {{ param }}
                        </td>
                        <td class="scrollable">
                          <code class="d-block pa-2" 
                            v-html="describeType(paramTypes[param])"
                          ></code>
                        </td>
                        <td class="scrollable">
                          <code class="d-block pa-2" 
                            v-if="value.params[param]"
                            v-html="describeType(paramActual(param))"
                          ></code>
                        </td>
                        <td>
                          {{ operationVisuals.comments[param] }}
                        </td>
                        <td class="text-center">
                          <div v-if="operation.mutates.indexOf(param) + 1">
                            Yes
                          </div>
                        </td>
                        <td class="text-center">
                          <div v-if="operation.hasScope.indexOf(param) + 1">
                            Yes
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </v-simple-table>

                <div v-if="operation.scope.length">
                  <h2 class="mt-3">Scope</h2>

                  <v-simple-table class="fixed-table">
                    <colgroup>
                      <col style="width: 100px">
                      <col style="width: 50%;">
                      <col style="width: 50%;">
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Var</th>
                        <th>Type</th>
                        <th>Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="param in operation.scope">
                        <tr :key="param">
                          <td class="nowrap" :title="param">
                            {{ param }}
                          </td>
                          <td class="scrollable">
                            <code class="d-block pa-2" 
                              v-html="describeType(scopeType(param))"
                            ></code>
                          </td>
                          <td>
                            {{ operationVisuals.scopeComments[param] }}
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </v-simple-table>
                </div>

              </v-card-text>
            </v-card>
          </v-dialog>
        </td>
        <td v-if="showSingleLine">
          <ex-templated :template="operationVisuals.singleline" :text-style="{marginTop: '15px'}" class="ex-operation">
            <template #section="{ section }">
              <span 
                v-if="hasParameter(section)" 
                class="param-span"
                :class="{ 'blue-grey lighten-4 mx-3': mutatesParameter(section) }">

                <v-tooltip top v-if="!readOnly">
                  <template #activator="{ on }">
                    <v-chip x-small label outlined class="param-label" v-on="on" @click="toggleParameter(section)">
                      {{ section }}
                    </v-chip>
                  </template>
                  <span>
                    {{ operationVisuals.comments[section] }}
                    <span v-if="mutatesParameter(section)">
                      <br><br>This operation changes this value
                    </span>  
                  </span>
                </v-tooltip>

                <span v-if="hiddenParameter(section)"
                  class="ex-expression parenthesis">
                  <v-btn text @click="toggleParameter(section)">
                    show
                  </v-btn>
                </span>
                <ex-expression
                  key="value"
                  v-else
                  v-bind="$props"
                  class="parenthesis"
                  type="value"
                  :value="value.params[section]"
                  :context="paramContext(section)"
                  :context-details="paramContextDetails(section)"
                  :required-type="paramTypes[section]"
                  @input="setParam(section, $event)"
                  @remove="setParam(section)"
                ></ex-expression>

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
import { Expression, Type, TypeMap, OperationExpression, OperationPair, NoExpression, Operation, OperationTypes, Traverser, GetExpression, ConstantExpression, isArray, UpdateExpression, SetExpression } from 'expangine-runtime';
import { ListOptions, renameVariable } from '@/common';
import { OperationVisuals } from '../../ops/OperationVisuals';
import { getInput } from '../../../app/Input';
import { sendNotification } from '../../../app/Notify';
import ExpressionBase from '../ExpressionBase';


const STARTING_PARAM = '$wrapped';
const COMPLEXITY_LABELS = [
  'Low',
  'Medium',
  'High',
  'Very High',
];
const COMPLEXITY_LABEL_MAX = 'Too High';
const COMPLEXITY_COLORS = [
  'green',
  'yellow',
  'orange',
  'red darken-4',
];
const COMPLEXITY_COLOR_MAX = 'black';


export default ExpressionBase<OperationExpression>().extend({
  name: 'OperationEditor',
  data: () => ({
    hiddenParams: {} as Record<string, boolean>,
    inspecting: false,
  }),
  computed: {
    searchLabel(): string {
      return this.returnTypeMode
        ? this.returnTypeDescribed
        : this.forTypeMode
          ? this.forTypeDescribed
          : 'Operation';
    },
    searchItems(): ListOptions<OperationPair> {
      return this.returnTypeMode
        ? this.returnTypeOperations
        : this.forTypeMode
          ? this.forTypeOperations
          : this.allOperations;
    },
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
    complexity(): number {
      return this.value.getComplexity(this.registry.defs);
    },
    operationComplexity(): string {
      return COMPLEXITY_LABELS[Math.round(this.complexity)] || COMPLEXITY_LABEL_MAX;
    },
    operationComplexityColor(): string {
      return COMPLEXITY_COLORS[Math.round(this.complexity)] || COMPLEXITY_COLOR_MAX;
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
          .sort(this.sortListOption)
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
          .sort(this.sortListOption)
        : [];
    },
    allOperations(): ListOptions<OperationPair> {
      return this.registry.defs.getOperations()
        .map(this.getListOption)
        .sort(this.sortListOption)
      ;
    },
    showSingleLine(): boolean {
      return !!(!this.multiline 
        && this.operationVisuals
        && this.operationVisuals.singleline);
    },
  },
  methods: {
    describeType(type?: Type): string {
      return type ? this.registry.getTypeDescribeLong(type, '&nbsp;&nbsp;', '<br>') : '';
    },
    filterOperation(item: any, queryText: string, itemText: string) {
      if (isArray(item.tokens)) { 
        const queryTokens = this.tokens(queryText);

        return queryTokens.some((queryToken) => item.tokens.some((token: string) => token.indexOf(queryToken) !== -1));
      } else {
        return itemText.toLowerCase().indexOf(queryText.toLowerCase()) > 1;
      }
    },
    tokenize(text: string): string {
      return text.toLowerCase().replace(/[^a-z0-9]/, '');
    },
    tokens(text: string): string[] { 
      return text.split(/\s+/).map(this.tokenize).filter((token) => !!token);
    },
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
    hasParameter(name: string): boolean {
      return !!this.value.params[name];
    },
    mutatesParameter(name: string) {
      return this.operation 
        ? this.operation.mutates.indexOf(name) !== -1
        : false;
    },
    cancel() {
      if (this.startingValue) {
        this.input(this.startingValue);
      } else {
        this.remove();
      }
    },
    getListOption(value: OperationPair) {
      const { name: text, description, keywords } = this.registry.getOperationVisuals(value.op.id);

      const tokens = this.tokens(text)
        .concat(this.tokens(description))
        .concat(keywords ? keywords.map(this.tokenize) : []);

      return { 
        text,
        description,
        value,
        tokens,
      };
    },
    sortListOption(a: {text: string}, b: {text: string}): number {
      return a.text.localeCompare(b.text);
    },
    paramActual(name: string): Type | null {
      const paramExpr = this.value.params[name];
      if (!paramExpr) {
        return null;
      }

      const paramType = paramExpr.getType(this.registry.defs, this.paramContext(name));
      if (!paramType) {
        return null;
      }

      return Type.simplify(paramType);
    },
    scopeType(name: string): Type | null {
      return this.operationTypes
        ? this.registry.defs.getOperationInputType(this.operationTypes.scope[name], this.paramTypes)
        : null;
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
        return this.scopedContext();
      }

      return this.context;
    },
    scopedContext(): Type {
      const defs = this.registry.defs;
      const op = this.operation;
      const opTypes = this.operationTypes;

      if (!op || !opTypes)
      {
        return this.context;
      }

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

          renameVariable(this.value, previous, alias);

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

.fixed-table /deep/ table {
  table-layout: fixed;
  
  .scrollable {
    white-space: nowrap;
    overflow: scroll;
  }

  .nowrap {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
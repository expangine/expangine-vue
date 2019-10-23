<template>
  <operation-search 
    v-if="isEmpty"
    v-bind="$props"
    v-on="$listeners"
    :remap="changing"
  ></operation-search>

  <v-autocomplete
    v-else-if="changing"
    hide-details
    outlined
    clearable
    append-icon="mdi-close"
    label="Change Operation"
    :menu-props="{ maxWidth: 400 }"
    :items="changingOptions"
    :filter="filterOperation"
    @input="mapOperation"
    @click:append="changing = false">
    <template #item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-html="item.text"></v-list-item-title>
        <v-list-item-subtitle 
          style="white-space: normal"
          v-html="item.description"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>

  <table v-else class="expression-table">
    <tbody>
      <tr :style="rowStyle">
        <td :class="inOperationClass">
          <ex-expression-menu
            v-if="!readOnly"
            v-bind="$props"
            v-on="$listeners"
            class="mr-3"
            text="Op"
            :tooltip="operationTooltip">
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

              <v-menu offset-x open-on-hover class="d-inline" max-height="400" v-if="hasScope">
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

              <v-list-item @click="changing = true">
                <v-list-item-content>
                  <v-list-item-title>
                    Change
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Change this operation into a similar operation
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

            </template>
          </ex-expression-menu>

          <operation-inspector
            v-bind="$props"
            :show.sync="inspecting"
          ></operation-inspector>

        </td>
        <td v-if="showSingleLine">
          <ex-templated :template="operationVisuals.singleline" :text-style="innerStyle" class="ex-operation">
            <template #section="{ section }">
              <span 
                v-if="hasParameter(section)" 
                class="param-span"
                :class="{ 'blue-grey lighten-4': mutatesParameter(section) }"
                :style="innerStyle">

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

              <span v-else class="param-span" :style="innerStyle">
                <v-btn text @click="resetParam(section)">
                  {{ operationVisuals.defaults[section] || section }}
                </v-btn>
              </span>

            </template>
          </ex-templated>
        </td>
        <td v-else>
          <ex-templated :template="operationVisuals.singleline" :text-style="innerStyle">
            <template #section="{ section }">
              <span v-if="hasParameter(section)">
                <strong>{{ section }}</strong>
              </span>
              <span v-else class="param-span" :style="innerStyle">
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
                :tooltip="operationVisuals.comments[name]"
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
import { Expression, Type, AnyType, TypeMap, OperationExpression, OperationPair, NoExpression, Operation, OperationTypes, objectMap, OperationMapping } from 'expangine-runtime';
import { ListOptions, renameVariable } from '@/common';
import { OperationVisuals } from '../../ops/OperationVisuals';
import { getInput } from '../../../app/Input';
import { sendNotification } from '../../../app/Notify';
import { filterOperation, getListOption, getMappingListOption, sortMappingListOption } from './helpers';
import OperationSearch from './OperationSearch.vue';
import OperationInspector from './OperationInspector.vue';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<OperationExpression>().extend({
  name: 'OperationEditor',
  components: {
    OperationSearch,
    OperationInspector,
  },
  data: () => ({
    hiddenParams: {} as Record<string, boolean>,
    inspecting: false,
    changing: false,
  }),
  computed: {
    filterOperation: () => filterOperation,
    inOperationClass(): string {
      return (this.inOperation ? 'pl-0' : 'pl-3') + (this.readOnly ? ' display-none' : '');
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
    operationTooltip(): string {
      return this.operation
        ? this.operation.mutates.length > 0
          ? this.operationName + '<br><br>' + 'Mutates: ' + this.operation.mutates.join(', ')
          : this.operationName
        : '';
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
    paramActuals(): TypeMap {
      return objectMap(this.value.params, (expr, name) => this.paramActual(name) || AnyType.baseType);
    },
    changingOptions(): ListOptions<OperationMapping> {
      return this.registry.defs.getOperationsWithMapping(this.value.name, this.paramActuals)
        .map((value) => getMappingListOption(this.registry, value))
        .sort(sortMappingListOption)
      ;
    },
    showSingleLine(): boolean {
      return !!(!this.multiline 
        && this.operationVisuals
        && this.operationVisuals.singleline);
    },
    innerStyle(): any {
      return this.readOnly || (!this.multiline && this.operationVisuals.singleline.indexOf('{') === -1)
        ? {}
        : { marginTop: '15px' };
    },
    rowStyle(): any {
      return this.readOnly
        ? { height: 'auto' }
        : {};
    },
  },
  methods: {
    mapOperation(map: OperationMapping) {
      const params = this.value.params;

      this.value.name = map.to.id;
      this.value.params = objectMap(map.mapping, 
        (newParam, oldParam) => params[oldParam] as Expression, 
        (oldParam, newParam) => newParam as string,
      );

      this.changing = false;
      this.update();
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
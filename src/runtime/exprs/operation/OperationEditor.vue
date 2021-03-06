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
    v-focus-on-visible="[true, 'input']"
    @input="mapOperation"
    @click:append="changing = false">
    <template #item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-html="item.text"></v-list-item-title>
        <v-list-item-subtitle 
          :title="item.description"
          style="white-space: normal"
          v-html="item.description"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>

  <ex-templated v-else :template="template" class="ex-center-aligned">
    <template #prefix>
      <ex-expression-menu
        v-if="!readOnly"
        v-bind="$props"
        v-on="$listeners"
        text="Op"
        class="mr-1"
        :tooltip="operationTooltip"
        :class="inlineClass">
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

          <v-list-item v-if="!readOnly" @click="changing = true">
            <v-list-item-content>
              <v-list-item-title>
                Change
              </v-list-item-title>
              <v-list-item-subtitle>
                Change this operation into a similar operation
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="test">
            <v-list-item-content>
              <v-list-item-title>
                Test
              </v-list-item-title>
              <v-list-item-subtitle>
                Test this operation out
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </template>
      </ex-expression-menu>

      <operation-inspector
        v-bind="$props"
        :show.sync="inspecting"
      ></operation-inspector>

    </template>
    <template #section="{ section }">
      <operation-param
        :expression-props="$props"
        :name="section"
        :required-type="paramTypes[section]"
        :value="value"
        :context="paramContext(section)"
        :context-details="paramContextDetails(section)"
        :operation="operation"
        :operation-types="operationTypes"
        :operation-visuals="operationVisuals"
        :read-only="readOnly"
        @update="update"
      ></operation-param>
    </template>
  </ex-templated>
</template>

<script lang="ts">
import { Expression, Type, AnyType, TypeMap, OperationExpression, Operation, OperationTypes, objectMap, OperationMapping, Types } from 'expangine-runtime';
import { ListOptions, renameVariable } from '@/common';
import { OperationVisuals } from '../../ops/OperationVisuals';
import { getInput } from '../../../app/Input';
import { sendNotification } from '../../../app/Notify';
import { filterOperation, getMappingListOption, sortMappingListOption } from './helpers';
import { getTestOperation } from '../../../app/TestOperation';
import OperationSearch from './OperationSearch.vue';
import OperationParam from './OperationParam.vue';
import OperationInspector from './OperationInspector.vue';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<OperationExpression>().extend({
  name: 'OperationEditor',
  components: {
    OperationSearch,
    OperationParam,
    OperationInspector,
  },
  data: () => ({
    inspecting: false,
    changing: false,
  }),
  computed: {
    template(): string {
      return this.readOnly && this.operationVisuals.singlelineReadonly
        ? this.operationVisuals.singlelineReadonly(this.value.params)
        : this.operationVisuals.singleline;
    },
    filterOperation: () => filterOperation,
    inlineClass(): string {
      return (this.readOnly || this.multiline ? '' : 'pr-0 ') + 'pl-0' + (this.readOnly && !this.multiline ? ' d-none' : '');
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
        .filter((value) => this.registry.isValidOperation({ op: value.to, types: value.toTypes }))
        .map((value) => getMappingListOption(this.registry, value))
        .sort(sortMappingListOption)
      ;
    },
  },
  methods: {
    test() {
      getTestOperation({
        registry: this.registry,
        name: this.value.name,
      });
    },
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
    paramContextDetails(name: string): Record<string, string> {
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

      return Types.simplify(paramType);
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
@hover-color: rgba(2255,255,100,0.45);

.ex-center-aligned {
  /deep/ .templated-text:hover {
    background-color: @hover-color;

    & ~ .templated-text {
      background-color: @hover-color;
    }
  }
}
</style>
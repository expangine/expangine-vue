<template>
  <v-dialog v-model="visible" max-width="1000" :fullscreen="$vuetify.breakpoint.mdAndDown">
    <v-card v-if="visible">
      <v-card-title class="headline">
        Test Operation
        <v-chip 
          v-if="visuals.name" 
          label 
          class="ml-3"
        >{{ visuals.name }}</v-chip>
      </v-card-title>
      <v-card-text>
        <p v-html="visuals.description"></p>
        <table class="ex-table">
          <tbody>
            <template v-for="param in paramNames">
              <tr :key="param">
                <td>
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-chip label v-on="on">{{ param }}</v-chip>
                    </template>
                    <span v-html="visuals.comments[param]"></span>
                  </v-tooltip>
                </td>
                <td v-if="paramsConstant[param]">
                  <ex-type-input
                    :registry="registry"
                    :type="paramsConstant[param]"
                    :settings="paramsSettings[param]"
                    :value="params[param].value"
                    @input="setConstant(param, $event)"
                  ></ex-type-input>
                  <span v-if="showDefault(param)">
                    (default = {{ visuals.defaults[param] }})
                  </span>
                </td>
                <td v-else>
                  <ex-expression
                    :registry="registry"
                    :context="paramContext(param)"
                    :context-details="paramContextDetails(param)"
                    :required-type="paramTypes[param]"
                    :value="params[param]"
                    @input="setParam(param, $event)"
                    @remove="setParam(param)"
                  ></ex-expression>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="ex-center-aligned mt-3 px-3">
          <h4>Results</h4>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!resultAutomatic"
            icon
            class="mr-3"
            color="secondary"
            @click="updateResult(true)"
          ><v-icon>mdi-sync</v-icon></v-btn>
          <v-checkbox
            hide-details
            class="mt-0"
            label="Auto Update"
            v-model="resultAutomatic"
            @change="updateResult"
          ></v-checkbox>
        </div>
        <ex-data-string-box
          class="ma-3 mt-6"
          max-height="300px"
          quotes
          :registry="registry"
          :data="result"
        ></ex-data-string-box>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary"
          @click="close">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TypeMap, Expression, OperationExpression, ObjectType, ExpressionMap, NoExpression, ConstantExpression } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { testOperationDialog } from './TestOperation';
import { OperationVisuals } from '../runtime/ops/OperationVisuals';


export default Vue.extend({
  data: () => testOperationDialog,
  computed: {
    visuals(): OperationVisuals {
      return this.registry.getOperationVisuals(this.name);
    },
    paramTypes(): TypeMap {
      return this.registry.defs.getOperationExpectedTypes(this.name, this.params, {}, this.context);
    },
    paramsFiltered(): ExpressionMap {
      const filtered: ExpressionMap = {};
      for (const prop in this.params) {
        if (this.params[prop] !== NoExpression.instance) {
          filtered[prop] = this.params[prop];
        }
      }
      return filtered;
    },
  },
  watch: {
    params: {
      deep: true,
      handler() {
        this.updateResult();
      },
    },
  },
  methods: {
    setConstant(name: string, value: any) {
      const paramExpr = this.params[name];
      if (value === undefined || value === null) {
        this.$set(this.params, name, NoExpression.instance);
      } else if (paramExpr instanceof NoExpression) {
        this.$set(this.params, name, new ConstantExpression(value));
      } else if (paramExpr instanceof ConstantExpression) {
        paramExpr.value = value;
      }
      this.updateResult();
    },
    showDefault(name: string) {
      if (!this.op || this.op.optional.indexOf(name) === -1) {
        return false;
      }
      if (!this.visuals.defaults[name]) {
        return false;
      }
      const param = this.params[name];
      if (!param) {
        return false;
      }
      if (param instanceof ConstantExpression) {
        return param.value === undefined;
      }
      if (param instanceof NoExpression) {
        return true;
      }

      return false;
    },
    setParam(name: string, expr?: Expression) {
      this.$set(this.params, name, expr || NoExpression.instance);
      this.updateResult();
    },
    paramContext(name: string): Type {
      const defs = this.registry.defs;
      const { op, types } = this;
      
      if (op && types && op.hasScope.indexOf(name) !== -1) 
      {
        return this.scopedContext();
      }

      return this.context;
    },
    paramContextDetails(name: string): Record<string, string> {
      const defs = this.registry.defs;
      const { op, types, visuals } = this;
      let details: Record<string, string> = {};

      if (op && types && op.hasScope.indexOf(name) !== -1) 
      {
        details = { ...details };
        
        for (const scopeParam of op.scope)
        {
          details[scopeParam] = visuals.scopeComments[scopeParam];
        }
      }

      return details;
    },
    scopedContext(): Type {
      const defs = this.registry.defs;
      const { op, types } = this;
      
      if (!op || !types)
      {
        return this.context;
      }

      const { context, scope } = defs.getContextWithScope(this.context);

      for (const scopeParam of op.scope) 
      {
        const scopeType = defs.getOperationInputType(types.scope[scopeParam], this.paramTypes);

        if (scopeType) 
        {
          scope[scopeParam] = scopeType.getSimplifiedType();
        }
      }

      return context;
    },
    updateResult(forceUpdate: boolean = false) {
      if (!this.resultAutomatic && !forceUpdate) {
        return;
      }

      try {
        this.invalid = false;

        const op = new OperationExpression(this.name, this.paramsFiltered);
        const cmd = LiveRuntime.getCommand(op);

        this.result = cmd({});
      } catch (e) {
        this.invalid = true;
      }
    },
  },
});
</script>
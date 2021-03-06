<template>
  <table class="ex-table">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Do"
            tooltip="Execute this expression while the above expression is true">
            <template #prepend>
              <v-list-item v-if="!readOnly" @click="toggleConfigure">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ configureLabel }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Change the break variable or max iterations
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>  
          </ex-expression-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            :value="value.body"
            :context="bodyContext"
            @input="updateBody($event)"
            @remove="updateBody()"
          ></ex-expression>
        </td>
      </tr>
      <tr>
        <td>
          <ex-chip-menu
            text="While"
            tooltip="While this expression is true, execute the do expression"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            :value="value.condition"
            :required-type="conditionType"
            @input="updateCondition($event)"
            @remove="updateCondition()"
          ></ex-expression>
        </td>
      </tr>
      <template v-if="configuring">
        <tr>
          <td>
            <ex-chip-menu
              text="Break"
              tooltip="The name of the variable that can be set to TRUE to stop iteration at any point"
            ></ex-chip-menu>
          </td>
          <td>
            <v-text-field
              outlined
              hide-details
              v-model="value.breakVariable"
              v-focus-on-create="'input'"
              @input="update"
            ></v-text-field>
          </td>
        </tr>
        <tr>
          <td>
            <ex-chip-menu
              text="Max"
              tooltip="The maximum number of iterations to allow"
            ></ex-chip-menu>
          </td>
          <td>
            <v-text-field
              outlined
              hide-details
              type="number"
              v-model="value.maxIterations"
              @input="update"
            ></v-text-field>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, DoExpression, Expression, NoExpression, BooleanType } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<DoExpression>().extend({
  name: 'DoEditor',
  data: () => ({
    configuring: false,
  }),
  computed: {
    bodyContext(): Type {
      return this.registry.defs.getContext(this.context, this.value.getScope());
    },
    configureLabel(): string {
      return this.configuring
        ? 'Hide Do Options'
        : 'Show Do Options';
    },
  },
  methods: {
    updateCondition(condition?: Expression) {
      this.value.condition = condition || NoExpression.instance;
      this.update();
    },
    updateBody(body?: Expression) {
      this.value.body = body || NoExpression.instance;
      this.update();
    },
    toggleConfigure() {
      this.configuring = !this.configuring;
    },
  },
});
</script>
<template>
  <table class="expression-table">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Start"
            tooltip="The starting value in the For loop">
            <template #prepend>
              <v-list-item @click="toggleConfigure">
                <v-list-item-content>
                  {{ configureLabel }}
                </v-list-item-content>
              </v-list-item>
            </template>
          </ex-expression-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            type="value"
            :value="value.start"
            :required-type="variableType"
            @input="updateStart($event)"
            @remove="updateStart()"
          ></ex-expression>
        </td>
      </tr>
      <tr>
        <td>
          <ex-chip-menu
            text="End"
            tooltip="The ending value in the For loop (exclusive)"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            type="value"
            :value="value.end"
            :required-type="variableType"
            @input="updateEnd($event)"
            @remove="updateEnd()"
          ></ex-expression>
        </td>
      </tr>
      <tr>
        <td>
          <ex-chip-menu
            text="Do"
            tooltip="Execute this expression between the range of Start and End"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            type="body"
            :value="value.body"
            :context="bodyContext"
            @input="updateBody($event)"
            @remove="updateBody()"
          ></ex-expression>
        </td>
      </tr>
      <template v-if="configuring">
        <tr>
          <td>
            <ex-chip-menu
              text="Var"
              tooltip="The name of the variable that has the current number between Start and End"
            ></ex-chip-menu>
          </td>
          <td>
            <v-text-field
              outlined
              hide-details
              v-model="value.variable"
              @input="update"
            ></v-text-field>
          </td>
        </tr>
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
import { Type, ForExpression, Expression, NoExpression, BooleanType, NumberType } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ForExpression>().extend({
  name: 'ForEditor',
  data: () => ({
    configuring: false,
  }),
  computed: {
    variableType(): Type {
      return new NumberType({ whole: true, min: 0 });
    },
    bodyContext(): Type {
      return this.registry.defs.getContext(this.context, this.value.getScope());
    },
    configureLabel(): string {
      return this.configuring
        ? 'Hide For Options'
        : 'Show For Options';
    },
  },
  methods: {
    updateStart(start?: Expression) {
      this.value.start = start || NoExpression.instance;
      this.update();
    },
    updateEnd(end?: Expression) {
      this.value.end = end || NoExpression.instance;
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
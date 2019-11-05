<template>
  <table class="ex-table ex-striped">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Object"
            tooltip="Create a dynamic Object"
          >
            <template #prepend>
              <v-list-item @click="addProperty">
                <v-list-item-content>
                  <v-list-item-title>
                    Add Property
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Define a new property in the object
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </ex-expression-menu>
        </td>
        <td>
          <table class="ex-table" :class="{ 'ex-read-only': readOnly }">
            <template v-for="(value, prop) in value.props">
              <tbody :key="prop">
                <tr>
                  <td class="var-name py-2">
                    <span v-if="readOnly">
                      {{ prop }}
                      <v-icon>mdi-equal</v-icon>
                    </span>
                    <v-text-field
                      v-else
                      outlined
                      dense
                      hide-details
                      append-outer-icon="mdi-equal"
                      :error="isPropertyInvalid(prop)"
                      :value="prop"
                      @change="changeProperty(prop, $event)"
                    ></v-text-field>
                  </td>
                  <td>
                    <ex-expression
                      v-bind="$props"
                      :required-type="null"
                      :value="value"
                      @input="changePropertyExpression(prop, $event)"
                      @remove="removeProperty(prop)"
                    ></ex-expression>
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TypeMap, Expression, ExpressionMap, NoExpression, ObjectExpression, objectMap, objectValues, ObjectType, Traverser, GetExpression, SetExpression, UpdateExpression, ConstantExpression } from 'expangine-runtime';
import { obj, renameVariable } from '@/common';
import { getConfirmation } from '../../../app/Confirm';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ObjectExpression>().extend({
  name: 'ObjectEditor',
  methods: {
    addProperty(): void {
      this.$set(this.value.props, this.getNextPropertyName(), NoExpression.instance);
    },
    getNextPropertyName(): string {
      const names = 'abcdefghijklmnopqrstuvwxyz'.split('');
      let next = names.find((name) => !this.hasProperty(name));
      if (!next) {
        let index = 0;
        next = 'temp';
        while (this.hasProperty(next)) {
          next = 'temp' + index;
          index++;
        }
      }
      return next;
    },
    hasProperty(name: string) {
      return !!(this.value && this.value.props[name]);
    },
    isPropertyInvalid(prop: string): boolean {
      return !prop;
    },
    changePropertyExpression(prop: string, expr: Expression): void {
      this.$set(this.value.props, prop, expr);
      this.update();
    },
    changeProperty(oldProp: string, newProp: string): void {
      const oldProps = this.value.props;
      const newProps: ExpressionMap = {};

      for (const currentProp in oldProps) {
        newProps[currentProp === oldProp 
          ? newProp 
          : currentProp] = oldProps[currentProp];
      }

      this.value.props = newProps;
      this.update();
    },
    removeProperty(prop: string): void {
      this.$delete(this.value.props, prop);
      this.update();
    },
  },
});
</script>

<style lang="less" scoped>
.var-name {
  min-width: 200px;
  padding: 0px !important;
  padding-right: 12px !important;
}
</style>
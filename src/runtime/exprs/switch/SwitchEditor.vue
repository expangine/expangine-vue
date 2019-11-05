<template>
  <ex-draggable class="ex-table ex-striped" 
    tag="table" 
    ghost-class="ex-ghost"
    handle=".ex-sorting-handle" 
    :class="{ 'ex-three': sorting }"
    v-model="value.cases" 
    @end="update"
  >
    <tbody>
      <tr>
        <td v-if="sorting"></td>
        <td>
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Switch Value"
            tooltip="If a value equals one of a set of tests values, execute an expression.">
              <template #prepend>
                <v-list-item @click="addCase">
                  <v-list-item-content>
                    <v-list-item-title>
                      Add Case &amp; Then
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Adds a new Case &amp; Then to the bottom of the Switch.
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="sortStart">
                  <v-list-item-content>
                    <v-list-item-title>
                      Toggle Sort Cases
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Re-order the Cases cases with dragging
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-menu v-if="alternativeOperations.length > 1" max-height="400" offset-x open-on-hover class="d-inline">
                  <template #activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-content>
                        <v-list-item-title>
                          Change Switch Operation
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Change the comparison operation used to compare the value with the test values
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-avatar>
                        <v-icon>mdi-menu-right</v-icon>
                      </v-list-item-avatar>
                    </v-list-item>
                  </template>
                  <v-list>
                    <template v-for="op in alternativeOperations">
                      <v-list-item :key="op.value" @click="updateOperation(op.value)" :input-value="op.value === value.op">
                        <v-list-item-content>
                          <v-list-item-title>{{ op.text }}</v-list-item-title>
                          <v-list-item-subtitle>{{ op.description }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-menu>
              </template>
            </ex-expression-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            :value="value.value"
            :required-type="null"
            @input="updateValue($event)"
            @remove="updateValue()"
          ></ex-expression>
        </td>
      </tr>
    </tbody>
    <template v-for="(group, caseIndex) in value.cases">
      <tbody :key="caseIndex">
        <tr>
          <td v-if="sorting">
            <v-icon class="ex-sorting-handle">mdi-drag-horizontal</v-icon>
          </td>
          <td>
            <ex-chip-menu
              text="If Value ="
              tooltip="If the value equals any of these values return the Then expression.">
              <v-list>
                <v-list-item @click="addTestValue(caseIndex)">
                  <v-list-item-content>
                    Add Test Value
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="removeCase(caseIndex)">
                  <v-list-item-content>
                    Remove Test Values &amp; Then
                  </v-list-item-content>
                </v-list-item>
              </v-list>  
            </ex-chip-menu>
          </td>
          <td>
            <template v-for="(test, testIndex) in group[0]">
              <div :key="testIndex" class="my-3 ase-test">

                <v-chip v-if="testIndex" class="case-or">or</v-chip>

                <ex-expression
                  v-bind="$props"
                  :value="test"
                  :required-type="valueType"
                  @input="updateTestValue(caseIndex, testIndex, $event)"
                  @remove="updateTestValue(caseIndex, testIndex)"
                ></ex-expression>

              </div>
            </template>
          </td>
        </tr>
        <tr>
          <td v-if="sorting"></td>
          <td>
            <ex-chip-menu
              text="Then"
              tooltip="Execute this expression if the value above equals the switch value"
            ></ex-chip-menu>
          </td>
          <td>
            <ex-expression
              v-bind="$props"
              :value="group[1]"
              @input="updateBody(caseIndex, $event)"
              @remove="updateBody(caseIndex)"
            ></ex-expression>
          </td>
        </tr>
      </tbody>    
    </template>  
    <tbody>
      <tr>
        <td v-if="sorting"></td>
        <td>
          <ex-chip-menu
            text="Else"
            tooltip="If none of the values match, execute this expression"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            :value="value.defaultCase"
            @input="updateDefaultCase($event)"
            @remove="updateDefaultCase()"
          ></ex-expression>
        </td>
      </tr>
    </tbody>
  </ex-draggable>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, SwitchExpression, Expression, NoExpression, OperationPair, BooleanType } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { getConfirmation } from '../../../app/Confirm';
import { ListOptions } from '../../../common';


export default ExpressionBase<SwitchExpression>().extend({
  name: 'SwitchEditor',
  data: () => ({
    sorting: false,
  }),
  computed: {
    valueType(): Type | null {
      return this.value.value.getType(this.registry.defs, this.context);
    },
    alternativeOperations(): ListOptions<string> {
      const empty = {};
      const { valueType, registry } = this;
      if (!valueType) {
        return [];
      }

      return registry.defs
        .getOperationsWithReturnType(BooleanType.baseType)
        .filter(({ types, op }) => {
          const value = types.params.value 
            ? registry.defs.getOperationInputType(types.params.value, empty) 
            : null;
          const test = types.params.test 
            ? registry.defs.getOperationInputType(types.params.test, empty) 
            : null;

          return value && test && value.acceptsType(valueType) && test.acceptsType(valueType);
        })
        .map((pair) => {
          const value = pair.op.id;
          const { name: text, description } = registry.getOperationVisuals(value);

          return { text, description, value };
        })
      ;
    },
  },
  methods: {
    sortStart() {
      this.sorting = !this.sorting;
    },
    updateOperation(op: string) {
      this.value.op = op;
      this.update();
    },
    updateValue(value?: Expression) {
      this.value.value = value || NoExpression.instance;
      this.update();
    },
    updateTestValue(caseIndex: number, testIndex: number, testValue?: Expression) {
      if (!testValue) {
        this.value.cases[caseIndex][0].splice(testIndex, 1);
      } else {
        this.$set(this.value.cases[caseIndex][0], testIndex, testValue);
      }
      this.update();
    },
    addTestValue(caseIndex: number) {
      this.value.cases[caseIndex][0].push(NoExpression.instance);
      this.update();
    },
    updateBody(index: number, body?: Expression) {
      this.$set(this.value.cases[index], 1, body || NoExpression.instance);
      this.update();
    },
    addCase() {
      this.value.cases.push([[NoExpression.instance], NoExpression.instance]);
      this.update();
    },
    updateDefaultCase(otherwise?: Expression) {
      this.value.defaultCase = otherwise || NoExpression.instance;
      this.update();
    },
    async removeCase(index: number) {
      if (await getConfirmation()) {
        this.value.cases.splice(index, 1);
        this.update();
      }
    },
  },
});
</script>

<style lang="less" scoped>
.case-test {
  position: relative;

  .case-or {
    position: absolute;
    top: -22px;
    left: -18px;
  }
}
</style>
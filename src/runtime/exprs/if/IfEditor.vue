<template>
  <ex-draggable class="expression-table" 
    tag="table" 
    ghost-class="ghost"
    handle=".sorting-handle" 
    :class="{ three: sorting }"
    v-model="value.cases" 
    @end="update">
    <template v-for="(group, index) in value.cases">
      <tbody :key="index">
        <tr>
          <td v-if="sorting">
            <v-icon class="sorting-handle">mdi-drag-horizontal</v-icon>
          </td>
          <td>
            <ex-expression-menu 
              v-if="index === 0"
              v-bind="$props"
              v-on="$listeners"
              text="If"
              tooltip="If this condition is true, execute the then expression"
            >
              <template #prepend>
                <v-list-item @click="sortStart">
                  <v-list-item-content>
                    <v-list-item-title>
                      Toggle Sort If/Else If
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Re-order the If/Else If cases with dragging
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </ex-expression-menu>
            <ex-chip-menu
              v-else
              text="Else If"
              tooltip="If this condition is true, execute the then expression">
              <v-list>
                <v-list-item @click="removeGroup(index)">
                  <v-list-item-content>
                    Remove Else If &amp; Then
                  </v-list-item-content>
                </v-list-item>
              </v-list>  
            </ex-chip-menu>
          </td>
          <td>
            <ex-expression
              v-bind="$props"
              type="condition"
              :value="group[0]"
              :required-type="conditionType"
              @input="updateCondition(index, $event)"
              @remove="updateCondition(index)"
            ></ex-expression>
          </td>
        </tr>
        <tr>
          <td v-if="sorting"></td>
          <td>
            <ex-chip-menu
              text="Then"
              tooltip="Execute this expression if the condition above is true"
            ></ex-chip-menu>
          </td>
          <td>
            <ex-expression
              v-bind="$props"
              type="body"
              :value="group[1]"
              @input="updateBody(index, $event)"
              @remove="updateBody(index)"
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
            tooltip="If none of the conditions above are true, execute this expression"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            type="body"
            :value="value.otherwise"
            @input="updateElse($event)"
            @remove="updateElse()"
          ></ex-expression>
        </td>
      </tr>
    </tbody>
  </ex-draggable>
</template>

<script lang="ts">
import Vue from 'vue';
import { IfExpression, Expression, NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { getConfirmation } from '../../../app/Confirm';


export default ExpressionBase<IfExpression>().extend({
  name: 'IfEditor',
  data: () => ({
    sorting: false,
  }),
  methods: {
    sortStart() {
      this.sorting = !this.sorting;
    },
    updateCondition(index: number, condition?: Expression) {
      this.$set(this.value.cases[index], 0, condition || NoExpression.instance);
      this.update();
    },
    updateBody(index: number, body?: Expression) {
      this.$set(this.value.cases[index], 1, body || NoExpression.instance);
      this.update();
    },
    addGroup() {
      this.value.cases.push([NoExpression.instance, NoExpression.instance]);
      this.update();
    },
    updateElse(otherwise?: Expression) {
      this.value.otherwise = otherwise || NoExpression.instance;
      this.update();
    },
    async removeGroup(index: number) {
      if (await getConfirmation()) {
        this.value.cases.splice(index, 1);
        this.update();
      }
    },
  },
});
</script>
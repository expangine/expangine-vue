<template>
  <ex-draggable class="ex-table ex-striped" 
    tag="table" 
    ghost-class="ex-ghost"
    handle=".ex-sorting-handle" 
    :class="{ 'ex-three': sorting }"
    v-model="value.cases" 
    @end="update"
  >
    <template v-for="(group, index) in value.cases">
      <tbody :key="index">
        <tr>
          <td v-if="sorting">
            <v-icon class="ex-sorting-handle">mdi-drag-horizontal</v-icon>
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
                <v-list-item v-if="!readOnly" @click="sortStart">
                  <v-list-item-content>
                    <v-list-item-title>
                      Toggle Sort If/Else If
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Re-order the If/Else If cases with dragging
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="canShowElse" @click="toggleElse">
                  <v-list-item-content>
                    <v-list-item-title>
                      Add Else
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      If none of the If conditions are true, do Else
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="canHideElse" @click="toggleElse">
                  <v-list-item-content>
                    <v-list-item-title>
                      Hide Else
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      If none of the If conditions are true, do Else
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
            <ex-expression-menu
              v-if="isChain(group[1])"
              v-bind="$props"
              :value="group[1]"
              text="Then"
              tooltip="Execute this expression if the condition above is true"
              @input="updateBody(index, $event)"
              @remove="updateBody(index)"
            ></ex-expression-menu>
            <ex-chip-menu
              v-else
              text="Then"
              tooltip="Execute this expression if the condition above is true"
            ></ex-chip-menu>
          </td>
          <td>
            <ex-expression
              v-bind="$props"
              :value="group[1]"
              @input="updateBody(index, $event)"
              @remove="updateBody(index)"
            ></ex-expression>
          </td>
        </tr>
      </tbody>    
    </template>  
    <tbody>
      <tr v-if="showElse">
        <td v-if="sorting"></td>
        <td>
          <ex-expression-menu
            v-if="isChain(value.otherwise)"
            v-bind="$props"
            :value="value.otherwise"
            text="Else"
            tooltip="If none of the conditions above are true, execute this expression"
            @input="updateElse($event)"
            @remove="updateElse()"
          ></ex-expression-menu>
          <ex-chip-menu
            v-else
            text="Else"
            tooltip="If none of the conditions above are true, execute this expression"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
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
import { IfExpression, Expression, NoExpression, ChainExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { getConfirmation } from '../../../app/Confirm';
import { Preferences, PreferenceCategory } from '../../../app/Preference';


const PREF_REMOVE_ELSEIF = Preferences.define({
  key: 'if_remove_elseif',
  label: 'Remove Else If from If expressions without confirmation',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default ExpressionBase<IfExpression>().extend({
  name: 'IfEditor',
  data: () => ({
    sorting: false,
    showingElse: false,
  }),
  computed: {
    showElse(): boolean {
      return this.showingElse || this.value.otherwise !== NoExpression.instance;
    },
    canShowElse(): boolean {
      return this.value.otherwise === NoExpression.instance && !this.showingElse;
    },
    canHideElse(): boolean {
      return this.value.otherwise === NoExpression.instance && this.showingElse;
    },
  },
  methods: {
    sortStart() {
      this.sorting = !this.sorting;
    },
    toggleElse() {
      this.showingElse = !this.showingElse;
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
    isChain(expr: Expression) {
      return expr instanceof ChainExpression;
    },
    async removeGroup(index: number) {
      if (await getConfirmation({ pref: PREF_REMOVE_ELSEIF })) {
        this.value.cases.splice(index, 1);
        this.update();
      }
    },
  },
});
</script>
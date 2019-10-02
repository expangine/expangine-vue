<template>
  <span v-if="hasValue && visuals" class="ex-expression" :class="{ multiline }">
    <component
      v-if="readOnly"
      :is="visuals.viewer"
      v-bind="$props"
      v-on="$listeners"
    ></component>
    <component v-else
      :is="visuals.editor"
      v-bind="$props"
      v-on="$listeners"
    ></component>
  </span>
  <span v-else-if="hasValue">
    No expression visuals exist for {{ value.getId() }}.
  </span>
  <span v-else>
    <v-menu>
      <template #activator="{ on }">
        <v-btn text v-on="on">
          <v-icon>mdi-plus</v-icon>
          {{ type }}
        </v-btn>
      </template>
      <v-list>
        <template v-for="expr in starters">
          <v-list-item :key="expr.expr.id" @click="startWith(expr)">
            <v-list-item-content>
              <v-list-item-title>{{ expr.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression } from 'expangine-runtime';
import { ListOptions } from '../../common';
import { ExpressionTypes, ExpressionStarter, ExpressionVisuals, ExpressionModifierCallback } from './ExpressionVisuals';
import { getConfirmation } from '../../app/Confirm';
import ExpressionBase from './ExpressionBase';


export default ExpressionBase().extend({
  name: 'Expression',
  computed: {
    starters(): ExpressionVisuals[] {
      return this.registry.getExpressionsStart(this.type, this.requiredType);
    },
  },
  methods: {
    startWith(visuals: ExpressionVisuals) {
      this.input(visuals.create(this.requiredType));
    },
  },
});
</script>

<style lang="less" scoped>
.ex-expression {
  display: inline-block;

  &.multiline {
    display: block;
  }

  &:hover {
    background-color: rgba(0,0,0,0.05);
  }
}
</style>
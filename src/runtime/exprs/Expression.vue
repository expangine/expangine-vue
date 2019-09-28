<template>
  <span v-if="hasValue && visuals" class="ex-expression">
    <component
      v-if="readOnly"
      :is="visuals.viewer"
      v-bind="$props"
      v-on="$listeners"
    ></component>
    <span v-else>
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="requestRemove">
            <v-list-item-content>
              Remove
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <component
        :is="visuals.editor"
        v-bind="$props"
        v-on="$listeners"
      ></component>
    </span>
  </span>
  <span v-else-if="hasValue">
    No expression visuals exist for {{ value.getId() }}.
  </span>
  <span v-else>
    <v-menu>
      <template #activator="{ on }">
        <v-btn text v-on="on">Select a {{ type }} expression</v-btn>
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
import { ExpressionTypes, ExpressionStarter, ExpressionVisuals } from './ExpressionVisuals';
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
}
</style>
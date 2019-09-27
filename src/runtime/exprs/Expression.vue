<template>
  <div v-if="hasValue && visuals">
    <component
      v-if="readOnly"
      :is="visuals.viewer"
      v-bind="$props"
      v-on="$listeners"
    ></component>
    <component
      v-else
      :is="visuals.editor"
      v-bind="$props"
      v-on="$listeners"
    ></component>
  </div>
  <div v-else-if="hasValue">
    No expression visuals exist for {{ value.getId() }}.
  </div>
  <div v-else>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ExpressionTypes, ExpressionStarter, ExpressionVisuals } from './ExpressionVisuals';
import ExpressionBase from './ExpressionBase';


export default ExpressionBase().extend({
  name: 'Expression',
  props: {
    type: {
      type: String as () => ExpressionTypes,
    },
  },
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
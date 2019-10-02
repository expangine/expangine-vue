<template>
  <ex-chip-menu :text="text" :tooltip="statusTooltip" :color="statusColor" :dark="statusDark">
    <v-list>

      <slot name="prepend"></slot>

      <v-list-item v-if="canRemove" @click="requestRemove">
        <v-list-item-content>
          <v-list-item-title>
            Remove {{ visuals.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            The entire expression will be removed
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <template v-for="expr in modifiers">
        <v-list-item :key="expr.text" @click="modify(expr.value)">
          <v-list-item-content>
            <v-list-item-title>{{ expr.text }}</v-list-item-title>
            <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-menu offset-x open-on-hover style="display: inline">
        <template #activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-content>
              <v-list-item-title>
                Replace with...
              </v-list-item-title>
              <v-list-item-subtitle>
                The entire expression will be replaced with a new one
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-icon>mdi-menu-right</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </template>
        <v-list>
          <template v-for="expr in starters">
            <v-list-item :key="expr.expr.id" @click="changeTo(expr)">
              <v-list-item-content>
                <v-list-item-title>{{ expr.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>

      <slot name="append"></slot>

    </v-list>
  </ex-chip-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { ExpressionVisuals, ExpressionModifierCallback } from '../ExpressionVisuals';
import { getConfirmation } from '../../../app/Confirm';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase().extend({
  name: 'ex-expression-menu',
  props: {
    text: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  computed: {
    statusColor(): string {
      return this.invalid ? 'red darken-4' : this.color;
    },
    statusDark(): boolean {
      return this.invalid;
    },
    statusTooltip(): string {
      if (!this.invalid || !this.requiredType || !this.computedType) {
        return this.tooltip;
      }
      const actual = this.registry.getTypeDescribe(this.computedType);
      const expected = this.registry.getTypeDescribe(this.requiredType);

      return `Expected ${expected} but given ${actual}`;
    },
    starters(): ExpressionVisuals[] {
      return this.registry.getExpressionsStart(this.type, this.requiredType);
    },
    modifiers(): ListOptions<ExpressionModifierCallback> {
      return this.registry.getExpressionsModifiers(this.type, this.requiredType, this.value, this.computedType);
    },
  },
  methods: {
    async changeTo(visuals: ExpressionVisuals) {
      if (await getConfirmation()) {
        this.input(visuals.create(this.requiredType, this.context));
      }
    },
    async modify(callback: ExpressionModifierCallback) {
      if (await getConfirmation()) {
        this.input(callback());
      }
    },
  },
});
</script>
<template>
  <span class="d-inline-block">
    
    <ex-chip-menu :text="text" :tooltip="statusTooltip" :color="statusColor" :dark="statusDark">
      <v-list dense>

        <v-list-item v-if="hasTypeInformation" @click="showTypeInformation = true">
          <v-list-item-content>
            <v-list-item-title>
              Type Information
            </v-list-item-title>
            <v-list-item-subtitle>
              The expression's expected and actual type
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

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

        <ex-expression-clipboard :registry="registry">
          <template #default="{ copy }">
            <v-list-item @click="copy(value)">
              <v-list-item-content>
                <v-list-item-title>
                  Copy {{ visuals.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Add this expression to the clipboard
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </ex-expression-clipboard>

        <template v-for="expr in modifiers">
          <v-list-item :key="expr.text" @click="modify(expr.value)">
            <v-list-item-content>
              <v-list-item-title>{{ expr.text }}</v-list-item-title>
              <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-menu offset-x open-on-hover class="d-inline">
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
          <v-list dense>
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

        <ex-expression-clipboard :registry="registry" @pasted="input">
          <template #default="{ copiedOptions, paste }">
            <v-menu v-if="copiedOptions.length" offset-x open-on-hover class="d-inline">
              <template #activator="{ on }">
                <v-list-item v-on="on">
                  <v-list-item-content>
                    <v-list-item-title>
                      Paste...
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      The entire expression will be replaced with one from the clipboard
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-avatar>
                    <v-icon>mdi-menu-right</v-icon>
                  </v-list-item-avatar>
                </v-list-item>
              </template>
              <v-list dense>
                <template v-for="(expr, index) in copiedOptions">
                  <v-list-item :key="index" @click="paste(expr.value)">
                    <v-list-item-content>
                      <v-list-item-title>{{ expr.text }}</v-list-item-title>
                      <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-menu>
          </template>
        </ex-expression-clipboard>
        
        <slot name="append"></slot>

      </v-list>

    </ex-chip-menu>

    <v-dialog v-model="showTypeInformation" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ text }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-if="requiredType">
                <h4>Expected Type</h4>
                <code class="d-block pa-2" v-html="requiredTypeDescription"></code>
              </v-col>
              <v-col v-if="computedType">
                <h4>Actual Type</h4>
                <code class="d-block pa-2" v-html="computedTypeDescription"></code>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, AnyType, isFunction } from 'expangine-runtime';
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
  data: () => ({
    showTypeInformation: false,
  }),
  computed: {
    hasTypeInformation(): boolean {
      return !!(this.requiredType && !(this.requiredType instanceof AnyType))
          || !!(this.computedType && !(this.computedType instanceof AnyType));
    },
    statusColor(): string {
      return this.invalid ? 'error' : this.color;
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
    requiredTypeDescription(): string {
      return this.requiredType
        ? this.registry.getTypeDescribeLong(this.requiredType, '&nbsp;&nbsp;', '<br>')
        : '';
    },
    computedTypeDescription(): string {
      return this.computedType
        ? this.registry.getTypeDescribeLong(this.computedType, '&nbsp;&nbsp;', '<br>')
        : '';
    },
  },
  methods: {
    async changeTo(visuals: ExpressionVisuals) {
      if (await getConfirmation()) {
        this.input(visuals.create(this.requiredType, this.context));
      }
    },
    async modify(value: ExpressionModifierCallback) {
      const options = isFunction(value)
        ? undefined
        : value.options;
      const callback = isFunction(value)
        ? value
        : value.handler;

      if (await getConfirmation(options)) {
        const result = callback();
        if (result) {
          this.input(result);
        }
      }
    },
  },
});
</script>
<template>
  <span v-if="hasValue && visuals" class="ex-expression" :class="{ multiline, hasline }">
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
        <v-btn text v-on="on" :color="statusColor">
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

        <ex-expression-clipboard :registry="registry" @pasted="input">
          <template #default="{ copiedOptions, paste }">
            <v-menu offset-x open-on-hover style="display: inline" v-if="copiedOptions.length">
              <template #activator="{ on }">
                <v-list-item v-on="on">
                  <v-list-item-content>
                    <v-list-item-title>
                      Paste...
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Copy an expression from the clipboard
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-avatar>
                    <v-icon>mdi-menu-right</v-icon>
                  </v-list-item-avatar>
                </v-list-item>
              </template>
              <v-list>
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
        
        <v-list-item key="remove" @click="requestRemove" v-if="canRemove">
          <v-list-item-content>
            <v-list-item-title>Remove</v-list-item-title>
            <v-list-item-subtitle>Cancel adding expression</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, OperationExpression } from 'expangine-runtime';
import { ExpressionVisuals } from './ExpressionVisuals';
import ExpressionBase from './ExpressionBase';


export default ExpressionBase().extend({
  name: 'Expression',
  computed: {
    starters(): ExpressionVisuals[] {
      return this.registry.getExpressionsStart(this.type, this.requiredType);
    },
    statusColor(): string {
      return this.invalid ? 'error' : 'primary';
    },
    hasline(): boolean {
      return !(this.value.parent instanceof OperationExpression);
    },
  },
  methods: {
    startWith(visuals: ExpressionVisuals) {
      this.input(visuals.create(this.requiredType, this.context));
    },
  },
});
</script>

<style lang="less" scoped>
.ex-expression {
  display: inline-block;

  &.hasline {
    border-left: 1px solid rgba(0,0,0,0.1);
  }

  &.multiline {
    display: block;
  }

  &:hover {
    background-color: rgba(0,0,0,0.02);
  }
}
</style>
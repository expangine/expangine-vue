<template>
  <span 
    v-if="hasValue && visuals" 
    class="ex-expression" 
    :class="{ multiline, compact }" 
    :style="highlightStyle"
    v-on="eventListenersNative"
  >
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
      v-shortcuts="shortcuts"
    ></component>
  </span>

  <span 
    v-else-if="hasValue"
    v-on="eventListenersNative"
  >
    No expression visuals exist for {{ value.getId() }}.
  </span>

  <span 
    v-else-if="!readOnly"
    v-on="eventListenersNative"
  >
    <v-menu max-height="400">
      <template #activator="{ on }">
        <v-btn text :color="statusColor" 
          v-on="on" 
          v-focus-on-create
          v-shortcuts="shortcuts">
          <v-icon>mdi-plus</v-icon>
          Expression
        </v-btn>
      </template>
      <v-list class="py-0">
        <ex-child-filter>

          <template v-for="expr in starters">
            <v-list-item :key="expr.expr.id" @click="startWith(expr)">
              <v-list-item-content>
                <v-list-item-title>{{ expr.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>

          <ex-expression-clipboard 
            :registry="registry" 
            :context="context" 
            :required-type="requiredType" 
            @pasted="input">
            <template #default="{ copiedOptions, paste }">
              <v-menu v-if="copiedOptions.length" max-height="400" offset-x open-on-hover class="d-inline">
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

        </ex-child-filter>
      </v-list>
    </v-menu>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, OperationExpression, NoExpression } from 'expangine-runtime';
import { ShortcutContext } from '@/app/Shortcuts';
import { Preferences, PreferenceCategory } from '@/app/Preference';
import { sendNotification } from '@/app/Notify';
import { getConfirmation } from '@/app/Confirm';
import { ExpressionVisuals } from './ExpressionVisuals';
import ExpressionBase from './ExpressionBase';


const PREF_SHORTCUT_COPY = Preferences.define({
  key: 'expression_copy',
  label: 'Copy expression shortcut',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.SHORTCUT],
  defaultValue: '67__c',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_PASTE = Preferences.define({
  key: 'expression_paste',
  label: 'Paste expression shortcut',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.SHORTCUT],
  defaultValue: '86__c',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_CUT = Preferences.define({
  key: 'expression_cut',
  label: 'Cut expression shortcut',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.SHORTCUT],
  defaultValue: '88__c',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_REMOVE = Preferences.define({
  key: 'expression_remove',
  label: 'Remove expression shortcut',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.SHORTCUT],
  defaultValue: '8__c',
  component: 'ex-shortcut-input',
});


export default ExpressionBase().extend({
  name: 'Expression',
  computed: {
    starters(): ExpressionVisuals[] {
      return this.registry.getExpressionsStart(this.requiredType);
    },
    statusColor(): string {
      return this.invalid ? this.displayOptions.error : this.displayOptions.color;
    },
    compact(): boolean {
      return this.displayOptions.compact;
    },
    shortcuts(): ShortcutContext {
      return {
        downs: {
          [Preferences.get(PREF_SHORTCUT_COPY)]: this.copyExpression,
          [Preferences.get(PREF_SHORTCUT_PASTE)]: this.pasteExpression,
          [Preferences.get(PREF_SHORTCUT_CUT)]: this.cutExpression,
          [Preferences.get(PREF_SHORTCUT_REMOVE)]: this.requestRemove,
        },
      };
    },
  },
  methods: {
    startWith(visuals: ExpressionVisuals) {
      this.input(visuals.create(this.requiredType, this.context, this.registry));
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

  &.risky {
    background-color: #FFE0B2;
    
    &:hover {
      background-color: #FFB74D;
    }
  }

  &.compact {
    /deep/ .v-chip {
      font-size: 12px;
      height: 24px;
    }

    /deep/ .v-input__slot {
      min-height: 32px !important;
    }

    /deep/ .v-btn.v-btn--icon {
      width: 24px;
      height: 24px;
    }

    /deep/ .ex-table > tbody > tr > td:nth-child(1) {
      padding: 8px;
    }
    
    /deep/ .param-span {
      margin-top: 2px;
      margin-bottom: 2px;
    }
  }

  &:hover {
    background-color: rgba(0,0,0,0.02);
  }
}
</style>
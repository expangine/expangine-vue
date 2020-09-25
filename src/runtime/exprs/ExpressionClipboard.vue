<template>
  <span>
    <template v-if="enabled">
      <slot v-bind="{ copied, copiedOptions, copy, paste }"></slot>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression } from 'expangine-runtime';
import { ListOptions } from '../../common';
import { Registry } from '../Registry';
import { getConfirmation } from '../../app/Confirm';
import { sendNotification } from '../../app/Notify';
import { Preferences, PreferenceCategory } from '../../app/Preference';


const PREF_PASTE = Preferences.define({
  key: 'paste_expression',
  label: 'Paste expression without confirmation',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const DESCRIPTION_MAX = 64;


export default Vue.extend({
  name: 'ExpressionClipboard',
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    context: {
      type: Object as () => Type,
    },
    requiredType: {
      type: Object as () => Type,
    },
  },
  computed: {
    copied(): Expression[] {
      return this.registry.expressionClipboard;
    },
    enabled(): boolean {
      return this.registry.isClipboardEnabled();
    },
    copiedOptions(): ListOptions<Expression> {
      const registry = this.registry;
      
      return this.copied.map((expr) => {
        const visual = registry.getExpressionVisuals(expr);

        return {
          text: visual.name,
          description: visual.describe({ registry, expr }),
          value: expr,
        };
      });
    },
  },
  methods: {
    copy(expr: Expression) {
      this.registry.copy(expr);

      const description = this.registry.getExpressionDescribe(expr);
      const shortened = description.length > DESCRIPTION_MAX
        ? description.substring(0, DESCRIPTION_MAX) + '...'
        : description;

      sendNotification({ message: 'Expression Copied: ' + shortened });
    },
    async paste(expr: Expression) {
      const { context, requiredType, registry } = this;

      let message = 'Are you sure?';

      if (context && requiredType) {
        const exprType = expr.getType(registry.defs, context);
        
        if (exprType && !requiredType.acceptsType(exprType)) {
          message = 'Are you sure? The expression does NOT return the required type.';
        }
      }

      if (await getConfirmation({ message, pref: PREF_PASTE })) {
        this.$emit('pasted', expr.clone());
      }
    },
  },
});
</script>
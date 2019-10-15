<template>
  <span>
    <slot v-bind="{ copied, copiedOptions, copy, paste }"></slot>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression } from 'expangine-runtime';
import { ListOptions } from '../../common';
import { Registry } from '../Registry';
import { getConfirmation } from '../../app/Confirm';
import { sendNotification } from '../../app/Notify';


const copyMax = 5;
const copyExpressions: Expression[] = [];


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
  data: () => ({
    copied: copyExpressions,
  }),
  computed: {
    copiedOptions(): ListOptions<Expression> {
      return this.copied.map((e) => {
        const visual = this.registry.getExpressionVisuals(e);
        return {
          text: visual.name,
          description: visual.description,
          value: e,
        };
      });
    },
  },
  methods: {
    copy(expr: Expression) {
      copyExpressions.unshift(this.clone(expr));
      if (copyExpressions.length > copyMax) {
        copyExpressions.splice(copyMax, copyExpressions.length - copyMax);
      }
      sendNotification({ message: 'Expression Copied' });
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

      if (await getConfirmation({ message })) {
        this.$emit('pasted', this.clone(expr));
      }
    },
    clone(expr: Expression): Expression {
      return this.registry.defs.cloneExpression(expr);
    },
  },
});
</script>
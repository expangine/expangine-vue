<template>
  <v-alert
    dense
    border="left"
    icon="mdi-pencil"
    class="ma-1 py-3 ex-expression-edit"
    :dismissible="removable"
    @click="edit"
    @input="remove"
  >{{ text }}</v-alert>
</template>

<script lang="ts">
import { getProgram } from '../app/GetProgram';
import ExpressionBase from '../runtime/exprs/ExpressionBase';


export default ExpressionBase().extend({
  props: {
    title: {
      type: String,
      default: 'Edit Expression',
    },
    message: {
      type: String,
    },
    removable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    text(): string {
      const describe = this.registry.getExpressionDescribe(this.value);

      return describe.length > 100 
        ? describe.substring(0, 100) + '...' 
        : describe.length === 0
          ? 'No Expression'
          : describe;
    },
  },
  methods: {
    async edit() {
      const { registry, title, message, context, requiredType: expectedType, value: program } = this;

      const result = await getProgram({
        title,
        message,
        context,
        program,
        registry,
        expectedType,
      });

      if (result && result.program) {
        this.$emit('input', result.program);
      }
    },
    remove() {
      this.$emit('remove');
    },
  },
});
</script>

<style lang="less" scoped>
.ex-expression-edit {
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.38);

  &:hover {
    background-color: rgba(0,0,0,0.1);
  }
}
</style>
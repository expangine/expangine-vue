<template>
  <div class="ex-center-aligned">

    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      class="mr-3"
      text="Comment"
      tooltip="Document your code"
    ></ex-expression-menu>

    <v-textarea
      key="expression"
      v-if="editing"
      dense
      auto-grow
      outlined
      full-width
      hide-details
      rows="1"
      class="ma-1 full-width"
      v-model="value.comment"
      v-focus-on-create="'textarea'"
      @change="update"
      @blur="finishEdit"
    ></v-textarea>

    <div v-else 
      class="pa-1 ma-1 full-width comment"
      v-html="readOnlyHTML"
      @click="edit"
    ></div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { CommentExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<CommentExpression>().extend({
  name: 'CommentEditor',
  data: () => ({
    editing: false,
  }),
  computed: {
    readOnlyHTML() {
      return this.value.comment.replace(/\n/g, '<br>');
    },
  },
  methods: {
    edit() {
      if (!this.readOnly) {
        this.editing = true;
      }
    },
    finishEdit() {
      this.editing = false;
    },
  },
});
</script>

<style lang="less" scoped>
.full-width {
  flex: 1 0 200px;
}

.comment {
  background-color: rgba(127,0,127,0.1);
  min-height: 32px;
}

.v-textarea {

  /deep/ .v-input__slot {
    padding: 0px !important;

    textarea {
      margin: 0px !important;
      padding: 4px !important;
      line-height: 24px;
    }
  }
}
</style>
<template>
  <span class="ex-symbol-spacer">
    <span class="ex-symbol">
      <span :class="typeClass"></span>
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';


const typeToClass: Record<string, string> = {
  '(': 'left-paren',
  ')': 'right-paren',
  '[': 'left-bracket',
  ']': 'right-bracket',
};

export default Vue.extend({
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    typeClass(): string {
      return 'ex-symbol-image ' + typeToClass[this.type];
    },
  },
});
</script>

<style lang="less" scoped>
.ex-symbol-spacer {
  width: 10px;
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
}

.ex-symbol {
  display: inline-block;
  position: absolute;
  top: 2px;
  bottom: 2px;
  width: 10px;

  .ex-symbol-image {
    background-position: center;
    background-size: contain;
    width: 100%;
    height: 100%;
    display: inline-block;

    &.left-paren { background-image: url(../../../assets/left-paren.png); }
    &.right-paren { background-image: url(../../../assets/right-paren.png); }
    &.left-bracket { background-image: url(../../../assets/left-bracket.png); }
    &.right-bracket { background-image: url(../../../assets/right-bracket.png); }
  }
}
</style>
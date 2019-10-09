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
    background-size: 10px 90%;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    display: inline-block;

    &.left-paren { 
      // background-image: url(../../../assets/left-paren.png); 
      border-radius: 13px;
      border-left: 4px solid black;
      width: 40px;
    }
    &.right-paren { 
      // background-image: url(../../../assets/right-paren.png); 
      border-radius: 13px;
      border-right: 4px solid black;
      width: 40px;
      left: -30px;
      position: relative;
    }
    &.left-bracket { 
      // background-image: url(../../../assets/left-bracket.png); 
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      border-left: 4px solid black;
      border-top: 4px solid black;
      border-bottom: 4px solid black;
      width: 8px;
      position: relative;
      margin-top: -7px;
      height: calc(100% + 20px);
    }
    &.right-bracket { 
      // background-image: url(../../../assets/right-bracket.png); 
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      border-right: 4px solid black;
      border-top: 4px solid black;
      border-bottom: 4px solid black;
      width: 8px;
      position: relative;
      margin-top: -7px;
      height: calc(100% + 20px);
    }
  }
}
</style>
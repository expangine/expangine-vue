<template>
  <div class="ex-code-box">
    <ex-data-menu 
      class="ex-data-menu"
      :button-props="{ fab: true, dark: true, color: 'primary', xSmall: true, right: true, top: true, absolute: true }"
      :data="data" 
      :registry="registry" 
      :type="givenType"
    ></ex-data-menu>
    <div class="ex-code-container" :style="containerStyle">
      <pre class="ex-code"><ex-data-string v-bind="$props"></ex-data-string></pre>
    </div>
  </div>
</template>

<script lang="ts">
import DataString from './DataString.vue';


export default DataString.extend({
  props: {
    maxHeight: {
      type: String,
    },
  },
  computed: {
    containerStyle() {
      return { 
        maxHeight: this.maxHeight,
        height: 'auto',
      };
    },
  },
});
</script>

<style lang="less" scoped>
.ex-code-box {
  position: relative;
}
</style>
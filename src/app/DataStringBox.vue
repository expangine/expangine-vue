<template>
  <div class="ex-code-container" :style="containerStyle">
    <pre class="ex-code"><ex-data-string v-bind="$props"></ex-data-string></pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
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
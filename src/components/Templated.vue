<template>
  <span>
    <template v-for="(name, index) in parts">
      <span :key="index" v-if="isText(index)" :style="textStyle" v-html="name" class="mx-1"></span>
      <span :key="index" v-else>
        <slot name="section" :section="name">{{ name }}</slot>
      </span>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
  props: {
    template: {
      type: String,
      required: true,
    },
    textStyle: {
      type: Object,
      default: null,
    },
  },
  computed: {
    parts(): string[] {
      return this.template.split(/[\{\}]/g);
    },
  },
  methods: {
    isText(index: number) {
      return index % 2 === 0;
    },
  },
});
</script>
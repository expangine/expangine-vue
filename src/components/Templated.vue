<template>
  <span>
    <template v-for="(name, index) in parts">
      <span :key="index" v-if="isText(index)" v-html="name"></span>
      <span :key="index" v-else>
        <slot name="section" :section="part">{{ name }}</slot>
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
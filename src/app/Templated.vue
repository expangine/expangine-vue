<template>
  <span>

    <slot name="prefix"></slot>

    <template v-for="part in parts">

      <span v-if="part.text" 
        class="mx-1 templated-text"
        :key="part.index" 
        :style="textStyle" 
        v-html="part.name" 
      ></span>

      <span v-else-if="part.section"
        :key="part.index">
        <slot name="section" :section="part.name">{{ part.name }}</slot>
      </span>

    </template>

    <slot name="suffix"></slot>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { templateTokens } from '@/common';


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
    parts(): Array<{ name: string, index: number, text: boolean, section: boolean }> {
      return templateTokens(this.template).map((name, index) => ({
        name,
        index,
        text: index % 2 === 0 && !!name,
        section: index % 2 === 1,
      }));
    },
  },
});
</script>
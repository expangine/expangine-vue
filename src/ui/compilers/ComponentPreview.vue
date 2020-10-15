<template>
  <span></span>
</template>

<script lang="ts">
import { mount, NodeTemplate } from 'expangine-ui';
import Vue from 'vue';

export default Vue.extend({
  props: {
    template: {
      type: Array,
      required: true,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    template: {
      deep: true,
      handler() {
        this.refresh();
      },
    },
    data: {
      deep: true,
      handler() {
        this.refresh();
      },
    },
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh(): void {
      const target = this.$el as HTMLElement;
      const unwatched = this as any;
      target.innerHTML = '<span></span>';

      if (unwatched.component) {
        unwatched.component.destroy();
      }

      unwatched.component = mount(
        { ...this.data }, 
        this.template as NodeTemplate, 
        target.firstElementChild as HTMLElement,
      );
    },
  },
});
</script>
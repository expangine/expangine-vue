<template>
  <div v-intersect="handleFocus" class="ex-child-filter">
    <v-text-field
      ref="filter"
      solo
      hide-details
      :label="label"
      :append-icon="appendIcon"
      autocomplete="new-password"
      v-model="filter"
    ></v-text-field>
    <div ref="children">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { isNumber } from 'expangine-runtime';


export default Vue.extend({
  props: {
    childClass: {
      type: String,
      default: 'v-list-item',
    },
    label: {
      type: String,
      default: 'Filter',
    },
    appendIcon: {
      type: String,
      default: 'mdi-filter',
    },
  },
  data: () => ({
    filter: '',
    intersecting: false,
  }),
  computed: {
    childClassHidden(): string {
      return this.childClass + '--hidden';
    },
    childClasses(): string {
      return `.${this.childClass}, .${this.childClassHidden}`;
    },
  },
  watch: {
    filter() {
      this.updateVisible();
    },
  },
  methods: {
    handleFocus(entries: IntersectionObserverEntry[], observer: IntersectionObserver, isIntersecting: boolean) {
      if (isIntersecting) {
        if (!this.intersecting) {
          const filter = this.$refs.filter as Vue;
          const filterInput = filter.$el.querySelector('input') as HTMLInputElement;

          filterInput.focus();
          filterInput.select();

          this.intersecting = true;
        }
      } else if (this.intersecting) {
        this.intersecting = false;
        this.filter = '';
      }
    },
    updateVisible() {
      const parent = this.$refs.children as HTMLElement;
      const children = parent.querySelectorAll(this.childClasses);
      const lowered = this.filter.toLowerCase();

      children.forEach((child) =>
      {
        const visible = this.isVisible(child, lowered);

        if (child instanceof HTMLElement) 
        {
          child.style.display = visible ? '' : 'none';
        }

        if (visible && child.classList.contains(this.childClassHidden)) 
        {
          child.classList.add(this.childClass);
          child.classList.remove(this.childClassHidden);
        } 
        else if (!visible && child.classList.contains(this.childClass)) 
        {
          child.classList.remove(this.childClass);
          child.classList.add(this.childClassHidden);
        }
      });

      let node = this.$parent as any;

      while (node)
      {
        if (isNumber(node.listIndex))
        {
          node.listIndex = -1;
          break;
        }

        node = node.$parent;
      }

      this.$emit('filter', this.filter);
    },
    isVisible(el: Element, filter: string): boolean {
      return !filter || !(el instanceof HTMLElement) || el.innerText.toLowerCase().indexOf(filter) !== -1;
    },
  },
});
</script>

<style lang="less" scoped>
.ex-child-filter {
  max-width: 500px;
}
</style>
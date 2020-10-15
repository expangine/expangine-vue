<template>
  <span>
    <div class="ex-node-label left persistent">for</div>
    <ex-node-children
      v-bind="$props"
      v-model="children"
      :context="childContext"
      @select="select"
    ></ex-node-children>
  </span>
</template>

<script lang="ts">
import { Expression, Exprs, NoExpression, Type } from 'expangine-runtime';
import { NodeTemplateChild, NodeTemplateValues } from 'expangine-ui';
import { CollectionType, getCollectionTypes } from './index';
import CompilerViewerBase from '../CompilerViewerBase';


type ForType = [string, { items: Expression }, {}, NodeTemplateChild[]];

export default CompilerViewerBase<ForType>().extend({
  data: () => ({
    itemsRequiredType: CollectionType,
  }),
  computed: {
    children: {
      get(): NodeTemplateChild[] {
        return this.value[3] || [];
      },
      set(children: NodeTemplateChild[]) {
        this.$set(this.value, 3, children);
        this.update();
      },
    },
    attributes(): NodeTemplateValues {
      return this.value[1] || {};
    },
    items(): Expression {
      return this.attributes.items || NoExpression.instance;
    },
    item(): string {
      return this.attributes.item || 'item';
    },
    index(): string {
      return this.attributes.index || 'index';
    },
    itemsType(): Type | null {
      return this.items.getType(this.registry.defs, this.context);
    },
    collectionTypes(): [Type, Type] | false {
      return this.itemsType
        ? getCollectionTypes(this.itemsType)
        : false;
    },
    childContext(): Type {
      const keyValue = this.collectionTypes;
      if (!keyValue) {
        return this.context;
      }

      return this.registry.defs.getContext(this.context, {
        [this.index]: keyValue[0],
        [this.item]: keyValue[1],
      });
    },
  },
});
</script>
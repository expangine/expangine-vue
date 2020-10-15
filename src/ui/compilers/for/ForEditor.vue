<template>
  <div>
    <h3>Items</h3>
    <ex-expression-edit-button
      title="For"
      message="The collection to iterate. Each value in the collection will render the components in this For component."
      v-model="items"
      :context="context"
      :registry="registry"
      :read-only="readOnly"
      :required-type="itemsRequiredType"
    ></ex-expression-edit-button>
    <div v-if="collectionTypes">
      <h3>Key</h3>
      <ex-expression-edit-button
        title="Key"
        message="The expression which takes a value from the collection and generates a unique ID that is necessary for collections with a large number of values or for collections with complex value components."
        v-model="key"
        :registry="registry"
        :read-only="readOnly"
        :context="keyContext"
      ></ex-expression-edit-button>
    </div>
    <v-text-field
      outlined
      hide-details
      class="mt-5"
      :label="itemLabel"
      v-model="item"
    ></v-text-field>
    <v-text-field
      outlined
      hide-details
      class="mt-5"
      :label="indexLabel"
      v-model="index"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import { Expression, Exprs, NoExpression, Type } from 'expangine-runtime';
import { NodeTemplateValues } from 'expangine-ui';
import { CollectionType, getCollectionTypeLabels, getCollectionTypes } from './index';
import CompilerEditorBase from '../CompilerEditorBase';


export default CompilerEditorBase().extend({
  data: () => ({
    itemsRequiredType: CollectionType,
  }),
  computed: {
    attributes(): NodeTemplateValues {
      return this.value[1] || {};
    },
    items: {
      get(): Expression {
        return this.attributes.items || NoExpression.instance;
      },
      set(items: Expression) {
        this.$set(this.attributes, 'items', items);
        this.update();
      },
    },
    key: {
      get(): Expression {
        return this.attributes.key || Exprs.get(this.index);
      },
      set(key: Expression) {
        this.$set(this.attributes, 'key', key);
        this.update();
      },
    },
    item: {
      get(): string {
        return this.attributes.item || 'item';
      },
      set(item: string) {
        this.$set(this.attributes, 'item', item);
        this.update();
      },
    },
    index: {
      get(): string {
        return this.attributes.index || 'index';
      },
      set(index: string) {
        this.$set(this.attributes, 'index', index);
        this.update();
      },
    },
    itemsType(): Type | null {
      return this.items.getType(this.registry.defs, this.context);
    },
    collectionTypes(): [Type, Type] | false {
      return this.itemsType
        ? getCollectionTypes(this.itemsType)
        : false;
    },
    collectionLabels(): [string, string] {
      return getCollectionTypeLabels(this.itemsType);
    },
    keyContext(): Type {
      const keyValue = this.collectionTypes;
      if (!keyValue) {
        return this.context;
      }

      return this.registry.defs.getContext(this.context, {
        [this.index]: keyValue[0],
        [this.item]: keyValue[1],
      });
    },
    itemLabel(): string {
      return `${this.collectionLabels[1]} Variable Name`;
    },
    indexLabel(): string {
      return `${this.collectionLabels[0]} Variable Name`;
    },
  },
  methods: {
    update(): void {
      if (this.value[1] !== this.attributes) {
        this.$set(this.value, 1, this.attributes);
      }

      this.$emit('input', this.value);
    },
  },
});
</script>
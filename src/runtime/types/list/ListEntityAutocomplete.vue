<template>
  <div v-if="missingEntity">
    The Type {{ type.options }} does not exist.
  </div>
  <div v-else-if="missingDescribe">
    The Type {{ type.options }} does not have a description Expression configured.
  </div>
  <v-autocomplete
    v-else
    v-bind="settings.options"
    multiple
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :clearable="clearable"
    :items="entity.instances"
    :item-text="getEntityText"
    :item-value="getEntityIdentifier"
    v-model="entityValue"
  ></v-autocomplete>
</template>

<script lang="ts">
import { ListType, Entity, NoExpression, DataTypes, EntityType } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { ListEntityAutocompleteOptions } from './ListEntityAutocompleteTypes';
import { ListSubs } from './ListTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListEntityAutocompleteOptions, any[], ListSubs>().extend({
  name: 'ListEntityAutocomplete',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    clearable(): boolean {
      return !(this.readOnly || !this.settings.options.clearable);
    },
    entityType(): EntityType {
      return this.type.options.item as EntityType;
    },
    entity(): Entity | null {
      return this.registry.defs.getEntity(this.entityType.options);
    },
    missingEntity(): boolean {
      return !this.entity;
    },
    missingDescribe(): boolean {
      return !!(this.entity && (!this.entity.describe || this.entity.describe === NoExpression.instance));
    },
    entityValue: {
      get(): any {
        return this.computedValue && this.entity && Array.isArray(this.computedValue)
          ? this.computedValue.map((key) => this.getEntityIdentifier(key))
          : [];
      },
      set(id: any[]) {
        this.computedValue = this.entity && Array.isArray(id)
          ? id.map((key) => this.getEntityWith(key))
          : [];
      },
    },
  },
  methods: {
    getEntityText(instance: any) {
      return this.entity ? this.entity.getDescribe(LiveRuntime, instance) : '';
    },
    getEntityIdentifier(instance: any) {
      return this.entity ? this.entity.takeKey(LiveRuntime, instance) : '';
    },
    getEntityWith(id: any) {
      const entity = this.entity;

      return entity 
        ? entity.instances.find((instance) => DataTypes.equals(id, entity.takeKey(LiveRuntime, instance)))
        : null;
    },
  },
});
</script>

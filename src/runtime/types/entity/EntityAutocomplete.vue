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
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :items="entity.instances"
    :item-text="getEntityText"
    :item-value="getEntityIdentifier"
    v-model="entityValue"
  ></v-autocomplete>
</template>

<script lang="ts">
import { EntityType, Entity, NoExpression, DataTypes } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { EntityAutocompleteOptions } from './EntityAutocompleteTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<EntityType, EntityAutocompleteOptions, any>().extend({
  name: 'EntityAutocomplete',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    entity(): Entity | null {
      return this.registry.defs.getEntity(this.type.options);
    },
    missingEntity(): boolean {
      return !this.entity;
    },
    missingDescribe(): boolean {
      return !!(this.entity && (!this.entity.describe || this.entity.describe === NoExpression.instance));
    },
    entityValue: {
      get(): any {
        return this.computedValue && this.entity 
          ? this.getEntityIdentifier(this.computedValue) 
          : null;
      },
      set(id: any) {
        this.computedValue = this.entity
          ? this.getEntityWith(id)
          : null;
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

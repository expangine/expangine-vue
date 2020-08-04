<template>
  <div v-if="isConfigured">
    <ex-type-input
      :type="entity.type"
      :read-only="readOnly"
      :registry="registry"
      :settings="entitySettings"
      :path="path"
      :data="data"
      v-model="computedValue"
    ></ex-type-input>
  </div>
  <div v-else>
    The Type {{ type.options }} does not have input configured.
  </div>
</template>

<script lang="ts">
import { EntityType, Entity } from 'expangine-runtime';
import { EntityOptions } from './EntityTypes';
import TypeInputBase from '../TypeInputBase';
import { TypeSettings } from '../TypeVisuals';


export default TypeInputBase<EntityType, EntityOptions, any>().extend({
  name: 'Entity',
  computed: {
    entity(): Entity | null {
      return this.registry.defs.getEntity(this.type.options);
    },
    entitySettings(): TypeSettings | null {
      return this.entity
        ? this.registry.getTypeSettingsValidFor(this.entity.type, this.entity.meta)
          ? this.entity.meta
          : this.registry.getTypeSettings(this.entity.type)
        : null;
    },
    isConfigured(): boolean {
      return !!this.entitySettings;
    },
  },
});
</script>

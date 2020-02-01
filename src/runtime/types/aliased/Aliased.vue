<template>
  <div v-if="isConfigured">
    <ex-type-input
      :type="aliasedType"
      :read-only="readOnly"
      :registry="registry"
      :settings="aliasedSettings"
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
import { AliasedType, ObjectType } from 'expangine-runtime';
import { AliasedOptions } from './AliasedTypes';
import TypeInputBase from '../TypeInputBase';
import { TypeSettings } from '../TypeVisuals';


export default TypeInputBase<AliasedType, AliasedOptions, any>().extend({
  name: 'Aliased',
  computed: {
    aliasedType(): ObjectType | null {
      return this.registry.defs.aliased[this.type.options] || null;
    },
    aliasedSettings(): TypeSettings | null {
      return this.registry.typeSettings[this.type.options]
        ? this.registry.typeSettings[this.type.options]
        : this.aliasedType
          ? this.registry.getTypeSettings(this.aliasedType)
          : null;
    },
    isConfigured(): boolean {
      return !!this.aliasedType && !!this.aliasedSettings;
    },
  },
});
</script>

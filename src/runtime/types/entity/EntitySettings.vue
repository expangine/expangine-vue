<template>
  <span></span>
</template>

<script lang="ts">
import { EntityType } from 'expangine-runtime';
import { EntityOptions } from './EntityTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<EntityType, EntityOptions>().extend({
  name: 'EntitySettings',
});
</script>

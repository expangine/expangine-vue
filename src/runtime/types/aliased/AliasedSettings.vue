<template>
  <span></span>
</template>

<script lang="ts">
import { AliasedType } from 'expangine-runtime';
import { AliasedOptions } from './AliasedTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<AliasedType, AliasedOptions>().extend({
  name: 'AliasedSettings',
});
</script>

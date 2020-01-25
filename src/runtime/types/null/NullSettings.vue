<template>
  <span></span>
</template>

<script lang="ts">
import { NullType } from 'expangine-runtime';
import { NullOptions } from './NullTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<NullType, NullOptions>().extend({
  name: 'NullSettings',
});
</script>

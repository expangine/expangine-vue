<template>
  
</template>

<script lang="ts">
import { ManyType } from 'expangine-runtime';
import { ManyOptions } from './ManyTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<ManyType, ManyOptions>().extend({
  name: 'ManySettings',
});
</script>
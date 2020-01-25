<template>
  <span>Null</span>
</template>

<script lang="ts">
import { NullType } from 'expangine-runtime';
import { NullOptions } from './NullTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<NullType, NullOptions, any>().extend({
  name: 'Null',
});
</script>

<template>
  <div v-if="inputSelected">
    <component 
      :is="inputSelected.input" 
      v-bind="$props"
      v-on="$listeners"
    ></component>
  </div>
  <div v-else-if="type">
    No input is configured for the {{ type.id }} type.
  </div>
  <div v-else>
    No type was given.
  </div>
</template>

<script lang="ts">
import { Type } from 'expangine-runtime';
import { PropTypeAny } from '../../common';
import TypeInputBase from './TypeInputBase';


export default TypeInputBase<Type, any, any>(PropTypeAny).extend({
  
});
</script>

<style lang="sass" scoped>

</style>

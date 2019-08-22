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
import TypeInputBase from './types/TypeInputBase';


export default TypeInputBase<Type, any, any>([String, Number, Boolean, Array, Object, Function]).extend({
  
});
</script>

<style lang="sass" scoped>

</style>

<template>
  <v-progress-circular 
    v-if="loading"
    indeterminate 
    size="64"
  ></v-progress-circular>
  <div v-else-if="inputSelected">
    <component 
      :is="inputSelected.input" 
      v-bind="$props"
      v-on="$listeners"
    ></component>
    <v-overlay absolute v-if="reloading">
      <v-progress-circular 
        indeterminate 
        size="64"
      ></v-progress-circular>
    </v-overlay>
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
import TypeInputBase from './TypeInputBase';


export default TypeInputBase<Type, any, any>().extend({
  
});
</script>
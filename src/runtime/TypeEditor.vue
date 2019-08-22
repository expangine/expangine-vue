<template>
  <div v-if="visuals">
    <component 
      :is="visuals.editor" 
      v-bind="$props"
      v-on="$listeners"
    ></component>
  </div>
  <div v-else-if="type">
    No editor is configured for the {{ type.id }} type.
  </div>
  <div v-else>
    No type was given.
  </div>
</template>

<script lang="ts">
import { Type } from 'expangine-runtime';
import TypeEditorBase from './types/TypeEditorBase';


export default TypeEditorBase<Type, any>().extend({
  
});
</script>

<style lang="sass" scoped>

</style>

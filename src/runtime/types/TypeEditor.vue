<template>
  <div 
    v-if="visuals" 
    :class="classes"
    v-on="eventListenersNative"
  >
    <component 
      :is="visuals.editor" 
      v-bind="$props"
      v-on="$listeners"
    ></component>
  </div>
  
  <div 
    v-else-if="type"
    v-on="eventListenersNative"
  >
    No editor is configured for the {{ type.id }} type.
  </div>

  <div 
    v-else
    v-on="eventListenersNative"
  >
    No type was given.
  </div>
</template>

<script lang="ts">
import { Type } from 'expangine-runtime';
import TypeEditorBase from './TypeEditorBase';


export default TypeEditorBase<Type, any>().extend({
  
});
</script>
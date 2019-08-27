<template>
  <v-container>
    Map Grid
  </v-container>
</template>

<script lang="ts">
import { MapType } from 'expangine-runtime';
import { MapGridOptions } from './MapGridTypes';
import TypeInputBase from '../TypeInputBase';

export default TypeInputBase<MapType, MapGridOptions, Map<any, any>>(Map).extend({
  name: 'MapGrid',
});
</script>
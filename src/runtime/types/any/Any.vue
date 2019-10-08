<template>
  <div>
    <!-- Any -->
  </div>
</template>

<script lang="ts">
import { AnyType } from 'expangine-runtime';
import { AnyOptions } from './AnyTypes';
import { PropTypeAny } from '../../../common';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<AnyType, AnyOptions, any>(PropTypeAny).extend({
  name: 'Any',
});
</script>

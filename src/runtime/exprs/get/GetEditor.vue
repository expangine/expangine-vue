<template>
  <div class="ex-center-aligned pl-0">
  </div>
</template>

<script lang="ts">
import { GetExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<GetExpression>().extend({
  name: 'GetEditor',
});
</script>
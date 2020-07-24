<template>
  <span class="ex-center-aligned">

    <span v-if="readOnly" class="ml-3">{{ value.name }}</span>

    <v-autocomplete
      v-else
      outlined
      dense
      hide-details
      class="d-inline-block mx-2"
      :items="datas"
      v-model="value.name"
      v-focus-on-create="'input'"
      @change="update"
    ></v-autocomplete>

  </span>
</template>

<script lang="ts">
import { GetDataExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '../../../common';


export default ExpressionBase<GetDataExpression>().extend({
  name: 'GetDataEditor',
  computed: {
    datas(): ListOptions<string> {
      return this.registry.defs.data.keys.map((data) => ({
        text: data,
        value: data,
      }));
    },
  },
});
</script>
<template>
  <span class="ex-center-aligned">

    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Type"
      tooltip="Get a user-defined Type"
    ></ex-expression-menu>

    <span v-if="readOnly" class="ml-3">{{ value.name }}</span>

    <v-autocomplete
      v-else
      outlined
      dense
      hide-details
      class="d-inline-block mx-2"
      :items="entities"
      v-model="value.name"
      v-focus-on-create="'input'"
      @change="update"
    ></v-autocomplete>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { objectValues, GetEntityExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '../../../common';


export default ExpressionBase<GetEntityExpression>().extend({
  name: 'GetEntityEditor',
  computed: {
    entities(): ListOptions<string> {
      return this.registry.defs.entities.keys.map((entity) => ({
        text: entity,
        value: entity,
      }));
    },
  },
});
</script>
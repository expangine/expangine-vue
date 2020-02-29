<template>
  <span class="ex-center-aligned">

    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Relation"
      tooltip="Get a Relation"
    ></ex-expression-menu>

    <span v-if="readOnly" class="ml-3">{{ value.name }}</span>

    <v-autocomplete
      v-else
      outlined
      dense
      hide-details
      class="d-inline-block mx-2"
      :items="relations"
      v-model="value.name"
      v-focus-on-create="'input'"
      @change="update"
    ></v-autocomplete>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { objectValues, GetRelationExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '../../../common';


export default ExpressionBase<GetRelationExpression>().extend({
  name: 'GetRelationEditor',
  computed: {
    relations(): ListOptions<string> {
      return this.registry.defs.relations.keys.map((relation) => ({
        text: relation,
        value: relation,
      }));
    },
  },
});
</script>
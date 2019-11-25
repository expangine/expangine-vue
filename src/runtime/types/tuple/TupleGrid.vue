<template>
  <v-container fluid class="tuple-form">
    <v-row v-if="settings.options.title">
      <v-col>
        <strong v-html="settings.options.title"></strong>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="(col, index) in settings.options.columns">
        <v-col
          :key="index"
          v-bind="col"
        >
          <tuple-grid-field
            :index="index"
            :value="computedValue"
            :type="type"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            :path="path"
            :data="data"
            @input="update"
          ></tuple-grid-field>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { TupleType } from 'expangine-runtime';
import { TupleSubs } from './TupleTypes';
import { TupleGridOptions } from './TupleGridTypes';
import TupleGridField from './TupleGridField.vue';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<TupleType, TupleGridOptions, any[], TupleSubs>(Array).extend({
  name: 'TupleGrid',
  components: {
    TupleGridField,
  },
});
</script>
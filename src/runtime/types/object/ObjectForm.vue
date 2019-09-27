<template>
  <v-container class="object-form">
    <v-row v-if="settings.options.title">
      <v-col>
        <strong v-html="settings.options.title"></strong>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="col in settings.options.columns">
        <v-col
          :key="col.prop"
          v-bind="col"
        >
          <object-form-field
            :prop="col.prop"
            :value="value"
            :type="type"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            @input="update"
          ></object-form-field>
        </v-col>
      </template>
      <template v-for="prop in propsOutside">
        <v-col
          :key="prop"
        >
          <object-form-field
            :prop="prop"
            :value="value"
            :type="type"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            @input="update"
          ></object-form-field>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ObjectType } from 'expangine-runtime';
import { ObjectFormOptions } from './ObjectFormTypes';
import TypeInputBase from '../TypeInputBase';
import ObjectFormField from './ObjectFormField.vue';


export default TypeInputBase<ObjectType, ObjectFormOptions, object>(Object).extend({
  name: 'ObjectForm',
  components: {
    ObjectFormField,
  },
  computed: {
    propsOutside(): string[] {
      const columns = this.settings.options.columns;
      const props = this.type.options.props;
      const propsCopy = Object.assign({}, props);
      
      for (const col of columns) {
        delete propsCopy[col.prop];
      }

      return Object.keys(propsCopy);
    },
  },
});
</script>

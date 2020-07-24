<template>
  <v-tabs>
    <v-tab>Data</v-tab>
    <v-tab>Data (json)</v-tab>
    <v-tab-item>
      <ex-data-string-box
        max-height="calc(100vh - 300px)"
        quotes              
        :registry="registry"
        :data="data"
        :type="dataType"
      ></ex-data-string-box>
    </v-tab-item>
    <v-tab-item>
      <div class="ex-code-container" style="max-height: calc(100vh - 300px)">
        <pre class="ex-code" v-html="rawString"></pre>
      </div>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, AnyType } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    data: {
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    dataType(): Type {
      const described = this.registry.defs.describe(this.data);
      if (described) {
        described.removeDescribedRestrictions();
      }
      return described || AnyType.baseType;
    },
    rawString(): string {
      return JSON.stringify(this.dataType.toJson(this.data), undefined, 2);
    },
  },
});
</script>
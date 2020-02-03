<template>
  <div class="ex-code-box">
    <code class="d-block pa-2" v-html="code"></code>
    <v-btn absolute fab top right small color="primary" @click="copy">
      <v-icon small>mdi-content-copy</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { CopyModifier } from '../runtime/hooks/ClipboardHooks';


export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    type: {
      type: Object as () => Type | null,
      default: null,
    },
  },
  computed: {
    code(): string {
      return this.type
        ? this.registry.getTypeDescribeLong(this.type, '&nbsp;&nbsp;', '<br>')
        : '';
    },
  },
  methods: {
    async copy() {
      const { type, registry } = this;

      if (type) {
        const typeSettings = registry.getTypeSettings(type);
        const option = CopyModifier.getOption({
          type, 
          registry,
          typeSettings,
        });

        if (option) {
          await option.value();
        }
      }      
    },
  },
});
</script>

<style lang="less" scoped>
.ex-code-box {
  position: relative;
}
</style>
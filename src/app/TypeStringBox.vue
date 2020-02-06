<template>
  <div class="ex-code-box">
    <code class="d-block pa-2" v-html="code"></code>
    <v-btn absolute fab top right small color="primary" @click="copy">
      <v-icon small>mdi-content-copy</v-icon>
    </v-btn>
    <v-btn v-if="canView" absolute fab bottom right small color="secondary" @click="view">
      <v-icon small>mdi-pencil</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, AliasedType } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { CopyModifier } from '../runtime/hooks/ClipboardHooks';
import { getEditAliased } from './EditAliased';


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
    canView(): boolean {
      return this.type instanceof AliasedType;
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
    async view() {
      const { type, registry } = this;

      if (type instanceof AliasedType) {
        await getEditAliased({
          name: type.options,
          registry,
        });
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
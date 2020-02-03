<template>
  <v-dialog persistent v-model="visible" max-width="600" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        {{ title }}
      </v-card-title>
      <v-card-text>
        
        <h3 class="mb-2">Encode</h3>

        <ex-expression
          :can-remove="false"
          :context="encodeContext"
          :registry="registry"
          :value="transcoder.encode"
          @input="updateEncoded"
        ></ex-expression>

        <h3 class="mt-3 mb-2">Decode</h3>

        <ex-expression  
          :can-remove="false"
          :context="decodeContext"
          :required-type="decodeExpected"
          :registry="registry"
          v-model="transcoder.decode"
        ></ex-expression>

      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          :disabled="disableSave"
          v-html="confirm" 
          @click="handle(true)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="unconfirm" 
          @click="handle(false)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { editTypeTranscoderDialog } from './EditTypeTranscoder';
import { Type, NoExpression, Expression, TypeStorageTranscoder } from 'expangine-runtime';


export default Vue.extend({
  data: () => editTypeTranscoderDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    title(): string {
      return `Transcoder for "${this.property}"`;
    },
    decodeContext(): Type {
      return this.storage.getDecodeContext(this.property);
    },
    decodeExpected(): Type {
      return this.storage.getDecodeExpected(this.property);
    },
    encodeContext(): Type {
      return this.storage.getEncodeContext(this.property);
    },
    disableSave(): boolean {
      const { encode, decode } = this.transcoder;

      return encode === NoExpression.instance
        || decode === NoExpression.instance
        || !this.isValid(encode, this.encodeContext)
        || !this.isValid(decode, this.decodeContext, this.decodeExpected);
    },
  },
  watch: {
    transcoder(transcoder: TypeStorageTranscoder) {
      this.updateEncoded(transcoder.encode);
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    updateEncoded(encode: Expression) {
      const encodedType = encode.getType(this.registry.defs, this.encodeContext);

      this.transcoder.encode = encode;

      if (encodedType) {
        this.transcoder.encodedType = encodedType;
      }
    },
    isValid(expr: Expression, context: Type, expected?: Type): boolean {
      if (expr.validations(this.registry.defs, context).length > 0) {
        return false;
      }
      if (expected) {
        const exprType = expr.getType(this.registry.defs, context);
        
        return !!(exprType && expected.acceptsType(exprType));
      }
      return true;
    },
  },
});
</script>
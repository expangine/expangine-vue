<template>
  <div>
    <h3 class="mb-2">Encode</h3>

    <ex-expression-editor
      :can-remove="false"
      :context="encodeContext"
      :registry="registry"
      :value="transcoder.encode"
      @input="updateEncoded"
    ></ex-expression-editor>

    <v-alert type="error" class="mt-2" v-if="invalidEncode">
      The encode expression is not valid. 
      You must have an expression which returns an encoded value.
    </v-alert>

    <h3 class="mt-3 mb-2">Decode</h3>

    <ex-expression-editor
      :can-remove="false"
      :context="decodeContext"
      :required-type="decodeExpected"
      :registry="registry"
      v-model="transcoder.decode"
      @input="saved"
    ></ex-expression-editor>

    <v-alert type="error" class="mt-2" v-if="invalidDecode">
      The decode expression is not valid. 
      You must have an expression which returns the decoded value and it must be the same type as the encoded value.
    </v-alert>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, NoExpression, Expression, Entity, EntityTranscoder } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    property: {
      type: String,
      required: true,
    },
    transcoder: {
      type: Object as () => EntityTranscoder,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    entity: {
      type: Object as () => Entity,
    },
  },
  computed: {
    decodeContext(): Type {
      return this.entity.getDecodeContext(this.property, this.transcoder.encodedType);
    },
    decodeExpected(): Type {
      return this.entity.getDecodeExpected(this.property);
    },
    encodeContext(): Type {
      return this.entity.getEncodeContext(this.property);
    },
    invalidEncode(): boolean {
      const { encode } = this.transcoder;

      return encode === NoExpression.instance || !this.isValid(encode, this.encodeContext);
    },
    invalidDecode(): boolean {
      const { decode } = this.transcoder;

      return decode === NoExpression.instance || !this.isValid(decode, this.decodeContext, this.decodeExpected);
    },
    valid(): boolean {
      return !this.invalidEncode && !this.invalidDecode;
    },
  },
  watch: {
    transcoder(transcoder: EntityTranscoder) {
      this.updateEncoded(transcoder.encode, true);
    },
  },
  methods: {
    updateEncoded(encode: Expression, skipSave: boolean = false) {
      const encodedType = encode.getType(this.registry.defs, this.encodeContext);

      this.transcoder.encode = encode;

      if (encodedType) {
        this.transcoder.encodedType = encodedType;
      }

      if (!skipSave) {
        this.saved();
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
    saved() {
      if (this.valid) {
        Vue.set(this.entity.transcoders, this.property, this.transcoder);

        this.$emit('saved', this.property);
      }
    },
  },
});
</script>
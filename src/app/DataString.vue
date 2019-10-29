<template>
  <span v-html="dataString"></span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, AnyType, TextType, ColorType, Color, ColorFormat, ColorSpaceRGB } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';


const colorFormat: ColorFormat<Color> = ColorSpaceRGB.formatMap.bestfit;
type DataToString = (data: any, t: Type) => string;

export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    data: {
      required: true,
    },
    type: {
      type: Object as () => Type | null,
      default: null,
    },
    singleLine: {
      type: Boolean,
      default: false,
    },
    html: {
      type: Boolean,
      default: false,
    },
    quotes: {
      type: Boolean,
      default: false,
    },
    newline: {
      type: String,
      default: null,
    },
    tab: {
      type: String,
      default: null,
    },
    padding: {
      type: String,
      default: '',
    },
    process: {
      type: Function,
      default: null,
    },
    processInvalid: {
      type: Function,
      default: null,
    },
  },
  computed: {
    givenType(): Type {
      return this.type || this.registry.defs.describe(this.data);
    },
    givenNewline(): string {
      return this.newline !== null
        ? this.newline
        : this.singleLine 
          ? '  '
          : this.html
            ? '<br>'
            : '\n';
    },
    givenTab(): string {
      return this.tab !== null
        ? this.tab
        : this.singleLine
          ? ''
          : this.html
            ? '&nbsp;&nbsp;'
            : '  ';
    },
    givenProcess(): DataToString {
      return (this.process as DataToString) || this.processDefault;
    },
    givenProcessInvalid(): DataToString {
      return (this.processInvalid as DataToString) || this.processInvalidDefault;
    },
    dataString(): string {
      return this.registry.getTypeToString(
        this.data, 
        this.givenType, 
        this.givenTab,
        this.givenNewline,
        this.padding,
        this.givenProcess,
        this.givenProcessInvalid,
      );
    },
  },
  watch: {
    dataString: {
      immediate: true,
      handler(dataString: string) {
        this.$emit('string', dataString);
      },
    },
  },
  methods: {
    processDefault(data: any, t: Type): string {
      return t instanceof TextType
        ? (this.quotes ? '"' + data + '"' : data)
        : t instanceof ColorType
          ? '<span class="ex-string-color" style="background-color: ' + colorFormat.formatter(data) + '"></span>' +  colorFormat.formatter(data)
          : undefined;
    },
    processInvalidDefault(data: any, t: Type): string {
      return '<span class="ex-string-invalid">' + JSON.stringify(data) + '</span>';
    },
  },
});
</script>

<style lang="less" scoped>
.ex-string-invalid {
  color: #e02618;
  border-bottom: 1px solid #e02618;
}

.ex-string-color {
  display: inline-block;
  width: 11px;
  height: 11px;
  top: 2px;
  position: relative;
  margin-right: 3px;
  margin-top: -2px;
}
</style>
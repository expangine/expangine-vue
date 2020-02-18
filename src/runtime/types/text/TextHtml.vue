<template>
  <div>
    <h5 v-if="settings.options.label">
      {{ settings.options.label }}
    </h5>
    <wysiwyg 
      :placeholder="settings.options.placeholder"
      :options="options"
      v-model="computedValue"
    ></wysiwyg>
  </div>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextHtmlOptions } from './TextHtmlTypes';
import TypeInputBase from '../TypeInputBase';


const ICONS = {
  bold: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-bold theme--light"></i>',
  italic: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-italic theme--light"></i>',
  underline: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-underline theme--light"></i>',
  justifyLeft: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-align-left theme--light"></i>',
  justifyCenter: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-align-center theme--light"></i>',
  justifyRight: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-align-right theme--light"></i>',
  headings: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-title theme--light"></i>',
  link: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-link theme--light"></i>',
  code: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-code-tags theme--light"></i>',
  orderedList: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-list-numbered theme--light"></i>',
  unorderedList: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-list-bulleted theme--light"></i>',
  image: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-image theme--light"></i>',
  table: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-table-plus theme--light"></i>',
  removeFormat: '<i aria-hidden="true" class="v-icon notranslate mdi mdi-format-clear theme--light"></i>',
};


export default TypeInputBase<TextType, TextHtmlOptions, string>(String).extend({
  name: 'TextHtml',
  computed: {
    options(): any {
      return {
        ...this.settings.options,
        iconOverrides: ICONS,
      };
    },
  },
});
</script>
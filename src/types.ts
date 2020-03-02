

declare module 'vue-markdown';

declare module 'v-click-outside';

declare module 'vue-timeago';

declare module 'vue-wysiwyg';

declare module 'vuedraggable';

declare module 'vuetify/lib/directives/click-outside';

declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'diff' {  
  export interface Part {
    value: string;
    added: boolean;
    removed: boolean;
  }

  export function diffLines(oldStr: string, newStr: string, options?: { ignoreWhitespace?: boolean, newlineIsToken?: boolean}): Part[];

  export function diffChars(oldStr: string, newStr: string, options?: { ignoreCase?: boolean }): Part[];

  export function diffWords(oldStr: string, newStr: string, options?: { ignoreCase?: boolean }): Part[];
}

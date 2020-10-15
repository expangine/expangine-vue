
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

declare module '*/docs/index.json' {
  import { NodeTemplateChild } from 'expangine-ui';

  type TypeDocumentation = string | Record<string, string | Record<string, string>>;

  const Documentation: {
    name: string;
    description: string;
    category: {
      [categoryName: string]: string;
    };
    types: {
      [typeName: string]: {
        [typeAttribute: string]: TypeDocumentation;
      };
    };
    components: {
      [id: string]: {
        category: string;
        description: string;
        preview?: NodeTemplateChild;
        template?: NodeTemplateChild;
        example?: NodeTemplateChild;
        attributes: {
          [attr: string]: {
            label: string;
            description: string;
            default?: string;
            callable?: TypeDocumentation;
            type?: TypeDocumentation;
          };
        };
        events: {
          [event: string]: {
            label: string;
            description: string;
            scope?: TypeDocumentation;
          };
        };
        slots: {
          [slot: string]: {
            label: string;
            description: string;
            scope?: TypeDocumentation;
            default?: string;
          };
        };
      };
    };
  };

  export default Documentation;
}


declare module 'diff' {
  
  export interface Part {
    value: string;
    added: boolean;
    removed: boolean;
  }

  export function diffLines(oldStr: string, newStr: string, options?: { ignoreWhitespace?: boolean, newlineIsToken?: boolean}): Part[];

}

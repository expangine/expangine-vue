import { Types, isString } from 'expangine-runtime';
import { Registry } from '../../Registry';

import { TextVisuals, TextBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(TextVisuals)
    .addTypeBuilder(TextBuilder)
    .addDataImportType({
      text: 'Text',
      priority: 6,
      is: (x) => isString(x),
      parse: (x) => x,
      allowsEmpty: true,
      typeOf: () => Types.text(),
    })
  ;
}

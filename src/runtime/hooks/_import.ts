import { Registry } from '../Registry';


import { ChangeTypeModifier } from './ChangeTypeModifier';
import { CopyModifier, PasteBuilder } from './ClipboardHooks';
import { DefaultWrapper } from './DefaultWrapper';
import { MigrationModifier } from './MigrationModifier';


export default function(registry: Registry)
{
  registry
    .addTypeModifier(ChangeTypeModifier)
    .addTypeBuilder(PasteBuilder)
    .addTypeModifier(CopyModifier)
    .addTypeBuilderWrapper(DefaultWrapper)
    .addTypeModifier(MigrationModifier)
  ;
}

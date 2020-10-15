
import { defs } from 'expangine-runtime';

import { Registry } from './Registry';

import HookImports from './hooks/_import';
import TypeImports from './types/_import';
import ExpressionImports from './exprs/_import';
import OperationImports from './ops/_import';
import UserInterfaceImports from '../ui/_import';


export default new Registry(defs)
  .import(TypeImports)
  .import(HookImports)
  .import(ExpressionImports)
  .import(OperationImports)
  .import(UserInterfaceImports)
  .import((registry) => registry.settingsOverrides = {
    outlined: true,
  })
;

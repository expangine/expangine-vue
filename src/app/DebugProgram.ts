
import { Type, Expression, AnyType, NoExpression } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';



export interface DebugProgramOptions
{
  type: Type;
  data: any;
  program: Expression;
  registry: Registry;
  visible: boolean;
  close: () => any;
}

export function getDebugProgramDefaults(): DebugProgramOptions
{
  return {
    type: AnyType.baseType,
    data: undefined,
    program: NoExpression.instance,
    registry: null as unknown as Registry,
    visible: false,
    close: () => undefined,
  };
}

export const debugProgramDialog = getDebugProgramDefaults();


export async function getDebugProgram(options: Partial<DebugProgramOptions> = {}): Promise<void>
{
  const { resolve, promise } = getPromiser<void>();

  Object.assign(debugProgramDialog, getDebugProgramDefaults());
  Object.assign(debugProgramDialog, options);

  debugProgramDialog.visible = true;
  debugProgramDialog.close = () => {
    resolve();
    debugProgramDialog.visible = false;
  };

  return promise;
}

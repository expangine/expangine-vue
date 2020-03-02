
import { Type, Expression, AnyType, NoExpression } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { Debugger } from './Debugger';



export interface DebugProgramOptions
{
  type: Type;
  data: any;
  program: Expression;
  debug: Debugger;
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
    debug: null as unknown as Debugger,
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

  if (!debugProgramDialog.debug) 
  {
    const { type: inputType, data: input, program, registry } = debugProgramDialog;

    debugProgramDialog.debug = new Debugger({
      registry,
      inputType,
      input,
      program,
    });
  }

  debugProgramDialog.visible = true;
  debugProgramDialog.close = () => {
    resolve();
    debugProgramDialog.visible = false;
  };

  return promise;
}


import { Type, Expression, AnyType, NoExpression, copy } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';


export interface RunProgramOptions
{
  type: Type;
  data: any;
  dataAfter: any;
  result: any;
  program: Expression;
  visible: boolean;
  registry: Registry;
  close: () => any;
}

export function getRunProgramDefaults(): RunProgramOptions
{
  return {
    type: AnyType.baseType,
    data: undefined,
    dataAfter: undefined,
    result: undefined,
    program: NoExpression.instance,
    visible: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const runProgramDialog = getRunProgramDefaults();

export async function getRunProgram(options: Partial<RunProgramOptions> = {}): Promise<void>
{
  const { resolve, promise } = getPromiser<void>();

  Object.assign(runProgramDialog, getRunProgramDefaults());
  Object.assign(runProgramDialog, options);

  const { registry, type, program, data } = runProgramDialog;

  const copyProgram = registry.defs.cloneExpression(program);
  const copyData = type.fromJson(type.toJson(data));
  const command = LiveRuntime.getCommand(copyProgram);
  const result = command(copyData);

  runProgramDialog.dataAfter = copyData;
  runProgramDialog.result = result;

  runProgramDialog.visible = true;
  runProgramDialog.close = () => {
    resolve();
    runProgramDialog.visible = false;
  };

  return promise;
}


import { Type, Expression, AnyType, NoExpression } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { measure } from './StopWatch';


export interface RunProgramOptions
{
  type: Type;
  data: any;
  dataString: string;
  dataAfter: any;
  dataAfterString: string;
  result: any;
  program: Expression;
  elapsedTime: string;
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: () => any;
}

export function getRunProgramDefaults(): RunProgramOptions
{
  return {
    type: AnyType.baseType,
    data: undefined,
    dataString: '',
    dataAfter: undefined,
    dataAfterString: '',
    result: undefined,
    program: NoExpression.instance,
    elapsedTime: '0',
    visible: false,
    fullscreen: false,
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

  const { type, program, data: originalData } = runProgramDialog;

  const data = type.fromJson(type.toJson(originalData));
  const { elapsedSummary, result } = measure(() => LiveRuntime.run(program, data));
  
  runProgramDialog.elapsedTime = elapsedSummary;
  runProgramDialog.dataAfter = data;
  runProgramDialog.result = result;

  runProgramDialog.visible = true;
  runProgramDialog.close = () => {
    resolve();
    runProgramDialog.visible = false;
  };

  return promise;
}


import { Type, Expression, AnyType, NoExpression } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';


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
  registry: Registry;
  useResults: null | ((results: any) => Promise<boolean>);
  useResultsLabel: string;
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
    registry: null as unknown as Registry,
    useResults: null,
    useResultsLabel: '',
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
  const command = LiveRuntime.getCommand(program);

  const start = now();

  const result = command(data);

  const end = now();
  const measureTime = -(now() - now());
  const elapsed = end - start - measureTime;

  const min = Math.floor(elapsed / 60000) % 60;
  const sec = Math.floor(elapsed / 1000) % 1000;
  const mil = Math.floor(elapsed) % 1000;
  const mic = Math.floor(elapsed * 1000) % 1000;
  const nan = Math.floor(elapsed * 1000000) % 1000;
  const total = (elapsed / 1000).toString();

  const elapsedTime = [];
  if (min > 0) {
    elapsedTime.push(min + ' m');
  }
  if (sec > 0) {
    elapsedTime.push(sec + ' s');
  }
  if (mil > 0) {
    elapsedTime.push(mil + ' ms');
  }
  if (mic > 0) {
    elapsedTime.push(mic + ' µs');
  }
  if (nan > 0) {
    elapsedTime.push(nan + ' ns');
  }
  elapsedTime.push('(' + total.substring(0, total.indexOf('.') + 10) + ' seconds total)');

  runProgramDialog.elapsedTime = elapsedTime.join(' ');
  runProgramDialog.dataAfter = data;
  runProgramDialog.result = result;

  runProgramDialog.visible = true;
  runProgramDialog.close = () => {
    resolve();
    runProgramDialog.visible = false;
  };

  return promise;
}

function now()
{
  return window.performance && window.performance.now
    ? window.performance.now()
    : Date.now
      ? Date.now()
      : new Date().getTime();
}

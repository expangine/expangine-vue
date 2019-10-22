
import { Type, Expression, AnyType, NoExpression, copy, CommandProvider, InvokeExpression } from 'expangine-runtime';
import { LiveRuntime, LiveCommand, LiveContext, LiveResult } from 'expangine-runtime-live';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getToStringSettings } from '@/common';


export interface DebugProgramOptions
{
  type: Type;
  data: any;
  program: Expression;
  steps: DebugStep[];
  currentStep: number;
  visible: boolean;
  registry: Registry;
  close: () => any;
}

export interface DebugStep 
{
  type: 'enter' | 'exit';
  depth: number;
  expr: Expression;
  program: Expression;
  context: LiveContext;
  contextType: Type;
  contextString: string;
  result?: any;
  resultType?: Type;
  resultString?: string;
}

export function getDebugProgramDefaults(): DebugProgramOptions
{
  return {
    type: AnyType.baseType,
    data: undefined,
    program: NoExpression.instance,
    steps: [],
    currentStep: 0,
    visible: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const debugToString = getToStringSettings();


export function debugDescribe(registry: Registry, rawValue: any, valueType?: Type)
{
  if (!valueType)
  {
    valueType = registry.defs.describe(rawValue);
    valueType.removeDescribedRestrictions();
  }

  const valueString = registry.getTypeToString(rawValue, valueType, debugToString.tab, debugToString.newline, '', debugToString.process, debugToString.processInvalid);

  const value = valueType.fromJson(valueType.toJson(rawValue));

  return { value, valueType, valueString };
}


export const debugProgramDialog = getDebugProgramDefaults();


export async function getDebugProgram(options: Partial<DebugProgramOptions> = {}): Promise<void>
{
  const { resolve, promise } = getPromiser<void>();

  Object.assign(debugProgramDialog, getDebugProgramDefaults());
  Object.assign(debugProgramDialog, options);

  const { registry, type, program, data, steps } = debugProgramDialog;

  let currentDepth = 0;
  const copyProgram = registry.defs.cloneExpression(program);
  const copyData = type.fromJson(type.toJson(data));
  const programStack: Expression[] = [copyProgram];


  const debugProvider: CommandProvider<LiveContext, LiveResult> = 
  {
    returnProperty: LiveRuntime.returnProperty,
    getFunction: (name) => LiveRuntime.getFunction(name),
    getOperation: (id) => LiveRuntime.getOperation(id),
    getOperationScopeDefaults: (id) => LiveRuntime.getOperationScopeDefaults(id),
    getCommand(expr: Expression) 
    {
      const run = LiveRuntime.getCommand(expr, debugProvider);

      return (context: LiveContext) => 
      {
        const enter = debugDescribe(registry, context);

        steps.push({
          type: 'enter',
          depth: currentDepth,
          program: programStack[0],
          expr,
          context: enter.value,
          contextType: enter.valueType,
          contextString: enter.valueString,
        });

        if (expr instanceof InvokeExpression) 
        {
          programStack.unshift(registry.defs.getFunction(expr.name).options.expression);
        }

        currentDepth++;

        const out = run(context);
        const output = debugDescribe(registry, out);
        const exit = debugDescribe(registry, context, enter.valueType);

        currentDepth--;

        if (expr instanceof InvokeExpression) 
        {
          programStack.shift();
        }

        steps.push({
          type: 'exit',
          depth: currentDepth,
          program: programStack[0],
          expr,
          context: exit.value,
          contextType: exit.valueType,
          contextString: exit.valueString,
          result: output.value,
          resultType: output.valueType,
          resultString: output.valueString,
        });

        return out;
      };
    },
  };
  
  const command = debugProvider.getCommand(copyProgram);

  command(copyData);

  debugProgramDialog.program = copyProgram;
  debugProgramDialog.visible = true;
  debugProgramDialog.close = () => {
    resolve();
    debugProgramDialog.visible = false;
  };

  return promise;
}


import { Type, Expression, AnyType, NoExpression, CommandProvider, InvokeExpression } from 'expangine-runtime';
import { LiveRuntime, LiveContext, LiveResult } from 'expangine-runtime-live';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';


export interface DebugProgramOptions
{
  type: Type;
  data: any;
  program: Expression;
  steps: DebugStep[];
  hoverStep: DebugStep | null;
  currentStep: DebugProgramResult;
  stepsLoaded: number;
  visible: boolean;
  registry: Registry;
  close: () => any;
}

export interface DebugStep 
{
  type: 'enter' | 'exit';
  depth: number;
  index: number;
  expr: Expression;
  program: Expression;
  context: LiveContext;
  contextType: Type;
  result?: any;
  resultType?: Type;
}

export interface DebugProgramResult
{
  program: Expression;
  step: number;
  stepInto: number;
  stepOver: number;
  stepOut: number;
  stepBack: number;
  stepDebug: DebugStep;
  end: boolean;
}

export function getDebugProgramDefaults(): DebugProgramOptions
{
  return {
    type: AnyType.baseType,
    data: undefined,
    program: NoExpression.instance,
    steps: [],
    stepsLoaded: 10,
    hoverStep: null,
    currentStep: null as unknown as DebugProgramResult,
    visible: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export function debugDescribe(registry: Registry, rawValue: any, valueType?: Type)
{
  if (!valueType)
  {
    valueType = registry.defs.describe(rawValue);
    valueType.removeDescribedRestrictions();
  }

  const value = valueType.fromJson(valueType.toJson(rawValue));

  return { value, valueType };
}


export const debugProgramDialog = getDebugProgramDefaults();


export async function getDebugProgram(options: Partial<DebugProgramOptions> = {}): Promise<void>
{
  const { resolve, promise } = getPromiser<void>();

  Object.assign(debugProgramDialog, getDebugProgramDefaults());
  Object.assign(debugProgramDialog, options);

  debugProgramDialog.currentStep = debugProgram(0);
  debugProgramDialog.visible = true;
  debugProgramDialog.close = () => {
    resolve();
    debugProgramDialog.visible = false;
  };

  return promise;
}


/**
 * Step Into (goto index = current + 1)
 * Step Over (if enter, goto exit; if exit, index = current + 1)
 * Step Out Of (goto to depth - 1 starting at current + 1)
 * Back (goto index = current - 1)
 */
export function debugProgram(step: number): DebugProgramResult
{
  const { registry, type, program, data: originalData } = debugProgramDialog;

  const data = type.fromJson(type.toJson(originalData));
  const programStack: Expression[] = [program];
  const stepInto = step + 1;
  let stepBack = step - 1;
  let stepOver = -1;
  let stepOut = -1;
  let stepCurrent = 0;
  let stepDebug: DebugStep = {
    type: 'enter',
    index: -1,
    depth: -1,
    expr: program,
    program,
    context: data,
    contextType: type,
  };
  let currentDepth = 0;
  let end = false;

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
        const isEnter = stepCurrent === step;
        const stepEnter = stepCurrent;

        if (isEnter)
        {
          const enter = debugDescribe(registry, context);

          stepDebug = {
            type: 'enter',
            index: stepCurrent,
            depth: currentDepth,
            program: programStack[0],
            expr,
            context: enter.value,
            contextType: enter.valueType,
          };
        }

        stepCurrent++;

        if (expr instanceof InvokeExpression) 
        {
          programStack.unshift(registry.defs.getFunction(expr.name).options.expression);
        }
        
        currentDepth++;

        const out = run(context);

        currentDepth--;

        if (expr instanceof InvokeExpression) 
        {
          programStack.shift();
        }

        const lastExpression = stepCurrent === stepEnter + 1 && isEnter;
        const isExit = stepCurrent === step;
        const isEnd = stepEnter === 0 && step > stepCurrent;

        if (isExit || lastExpression || isEnd)
        {
          const output = debugDescribe(registry, out);
          const exit = debugDescribe(registry, context);
          
          stepDebug = {
            type: 'exit',
            index: stepCurrent,
            depth: currentDepth,
            program: programStack[0],
            expr,
            context: exit.value,
            contextType: exit.valueType,
            result: output.value,
            resultType: output.valueType,
          }; 

          stepOver = stepCurrent + 1;
          stepOut = stepCurrent + 1;

          if (lastExpression)
          {
            stepBack = stepEnter - 1;
          }

          if (isEnd)
          {
            step = stepCurrent;
            end = true;
          }

          throw new Error('stop');
        }
        else if (isEnter)
        {
          stepOver = stepCurrent;
          stepOut = stepCurrent + 1;

          throw new Error('stop');
        }

        stepCurrent++;

        return out;
      };
    },
  };

  const command = debugProvider.getCommand(program);

  try {
    command(data);
  } catch (e) {
    // ignore error
  }

  return {
    program,
    step,
    stepInto,
    stepOver,
    stepOut,
    stepBack,
    stepDebug,
    end,
  };
}

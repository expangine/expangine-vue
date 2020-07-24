import { Type, TextType, Expression, CommandProvider, Traverser, isString } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';
import { StopWatchOutput, measure } from './StopWatch';
import { LiveRuntime, LiveContext, LiveResult } from 'expangine-runtime-live';
import { TypeSubNode } from '@/runtime/types/TypeVisuals';



export type DebugBreakpoint = [Expression, boolean];

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

export interface DebuggerOptions
{
  registry: Registry;
  inputType: Type;
  input: any;
  program: Expression;
}

export class Debugger
{

  public registry: Registry;
  public inputType: Type;
  public input: any;
  public program: Expression;
  public breakpoints: Map<Expression, boolean>;
  public elapsed: StopWatchOutput<DebugProgramResult>;
  public current: DebugProgramResult;
  public steps: DebugStep[];

  public constructor(options: DebuggerOptions)
  {
    this.breakpoints = new Map();
    this.registry = options.registry;
    this.inputType = options.inputType;
    this.input = options.input;
    this.program = options.program;
    this.elapsed = measure(() => this.goto(0));
    this.current = this.elapsed.result;
    this.steps = [];
  }

  public set(options: DebuggerOptions)
  {
    this.registry = options.registry;
    this.inputType = options.inputType;
    this.input = options.input;
    this.setProgram(options.program);
  }

  public setProgram(program: Expression)
  {
    if (this.program === program)
    {
      return;
    }

    if (this.breakpoints.size > 0)
    {
      const oldBreakpoints = new Map(
        Array.from(this.breakpoints.entries())
          .map(([expr, enabled]) => [
            expr.getPath().join('|'),
            [expr, enabled],
          ] as [string, DebugBreakpoint],
        ),
      );

      const newBreakpoints = new Map<Expression, boolean>();

      program.traverse(new Traverser((expr, stack, pathArray) => {
        const path = pathArray.join('|');
        const existing = oldBreakpoints.get(path);

        if (existing) {
          newBreakpoints.set(expr, existing[1]);
        }
      }));

      this.breakpoints = newBreakpoints;
    }
    
    this.program = program;
    this.reset();
  }

  public reset()
  {
    this.elapsed = measure(() => this.goto(0));
    this.current = this.elapsed.result;
    this.steps = [];
  }

  public addBreakpoint(expr: Expression)
  {
    this.mutateBreakpoints((breakpoints) => {
      breakpoints.set(expr, true);
    });
  }

  public removeBreakpoint(expr: Expression)
  {
    this.mutateBreakpoints((breakpoints) => {
      breakpoints.delete(expr);
    });
  }

  public mutateBreakpoints(withBreakpoints: (breakpoints: Map<Expression, boolean>) => void)
  {
    const copy = new Map(this.breakpoints.entries());

    withBreakpoints(copy);

    this.breakpoints = copy;
  }

  public describe(rawValue: any, valueType?: Type)
  {
    if (!valueType)
    {
      valueType = this.registry.defs.describe(rawValue);
      valueType.removeDescribedRestrictions();
    }

    const value = valueType.fromJson(valueType.toJson(rawValue));

    return { value, valueType };
  }

  public goto(step: number, stopAt?: Map<Expression, boolean>): DebugProgramResult
  {
    /**
     * Step Into (goto index = current + 1)
     * Step Over (if enter, goto exit; if exit, index = current + 1)
     * Step Out Of (goto to depth - 1 starting at current + 1)
     * Back (goto index = current - 1)
     */
    const { registry, inputType, program, input: originalInput } = this;

    const input = inputType.fromJson(inputType.toJson(originalInput));
    const programStack: Expression[] = [program];
    const innerStack: Expression[] = [];
    let stepInto = step + 1;
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
      context: input,
      contextType: inputType,
    };
    let currentDepth = 0;
    let end = false;
    let found = false;

    const debugProvider: CommandProvider<LiveContext, LiveResult> = 
    {
      returnProperty: LiveRuntime.returnProperty,
      getFunction: (name) => LiveRuntime.getFunction(name),
      getOperation: (id) => LiveRuntime.getOperation(id),
      getComputed: (id) => LiveRuntime.getComputed(id),
      getOperationScopeDefaults: (id) => LiveRuntime.getOperationScopeDefaults(id),
      getCommand: (expr: Expression) =>
      {
        const run = LiveRuntime.getCommand(expr, debugProvider);

        return (context: LiveContext) => 
        {
          const isSearchFound = stopAt && stepCurrent >= step && stopAt.get(expr) && !found;
          const isEnter = stepCurrent === step || isSearchFound;
          const stepEnter = stepCurrent;

          const inner = expr.getInnerExpression(registry.defs);

          if (isString(inner))
          {
            throw new Error(inner);
          }
          else if (inner !== false)
          {
            innerStack.unshift(inner);
          }

          const inside = expr === innerStack[0];

          if (inside)
          {
            programStack.unshift(expr);
          }

          if (isEnter)
          {
            const enter = this.describe(context);

            stepDebug = {
              type: 'enter',
              index: stepCurrent,
              depth: currentDepth,
              program: programStack[0],
              expr,
              context: enter.value,
              contextType: enter.valueType,
            };

            if (isSearchFound)
            {
              step = stepCurrent;
              stepInto = stepCurrent + 1;
              stepBack = stepCurrent - 1;
              stepOut = -1;
              found = true;
            }
          }

          stepCurrent++;
          
          currentDepth++;

          const out = run(context);

          currentDepth--;

          const lastExpression = stepCurrent === stepEnter + 1 && isEnter;
          const isExit = stepCurrent === step;
          const isEnd = stepEnter === 0 && step > stepCurrent;

          if (isExit || lastExpression || isEnd)
          {
            const output = this.describe(out);
            const exit = this.describe(context);
            
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

            if (lastExpression)
            {
              stepBack = stepEnter - 1;
            }

            if (isEnd)
            {
              step = stepCurrent;
              end = true;
            }
          }
          else if (isEnter)
          {
            stepOver = stepCurrent;
          }

          if (stepOut === -1 && currentDepth === stepDebug.depth - 1)
          {
            stepOut = stepCurrent;
          }

          stepCurrent++;

          if (inner !== false)
          {
            innerStack.shift();
          }

          if (inside)
          {
            programStack.shift();
          }

          return out;
        };
      },
    };

    const command = debugProvider.getCommand(program);

    try 
    {
      command(input);
    } 
    catch (e) 
    {
      window.console.log('error in debug', e);
    }

    if (stepOut === -1) 
    {
      stepOut = stepDebug.index + 1;
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

  public getInitialStep(): DebugStep 
  {
    return {
      type: 'enter',
      depth: -1,
      index: -1,
      program: this.program,
      expr: this.program,
      context: this.input,
      contextType: this.inputType,
    };
  }

  public getCallstack(): DebugStep[]
  {
    const stack: DebugStep[] = [];
    const steps = this.steps;
    const step = this.current.stepDebug;
    const currentIndex = step.index;
    let currentStep = this.steps.findIndex((s) => s.index === currentIndex);

    let depth = step.depth;

    while (currentStep >= 0) 
    { 
      const current = steps[currentStep];

      if (current.depth === depth) 
      {
        stack.push(current);
        depth--;
      }
      currentStep--;
    }

    stack.push(this.getInitialStep());
    
    return stack;
  }

  public getScopeNodes(): TypeSubNode[]
  {
    const nodes: TypeSubNode[] = [];
    const step = this.current.stepDebug;

    nodes.push({
      sub: 'Context',
      subType: TextType.baseType,
      value: step.context,
      valueType: step.contextType,
    });

    if (step.resultType) 
    {
      nodes.push({
        sub: 'Result',
        subType: TextType.baseType,
        value: step.result,
        valueType: step.resultType,
      });
    }

    return nodes;
  }

  public stepTo(index: number, stopAt?: Map<Expression, boolean>) 
  {
    this.elapsed = measure(() => this.goto(index, stopAt));
    this.current = this.elapsed.result;
    
    const currentStep = this.current.stepDebug;
    const currentStepIndex = this.steps.findIndex((s) => s.index === currentStep.index);

    if (currentStepIndex === -1) 
    {
      LiveRuntime.arrayAdd(this.steps, currentStep);
      this.steps.sort((a, b) => a.index - b.index);
    } 
    else 
    {
      LiveRuntime.arraySet(this.steps, currentStepIndex, currentStep);
    }
  }

  public first() 
  {
    this.steps = [];

    this.stepTo(0);
  }

  public last() 
  {
    this.stepTo(9007199254740991);
  }

  public stepBack() 
  {
    this.stepTo(this.current.stepBack);
  }

  public stepInto() 
  {
    this.stepTo(this.current.stepInto);
  }

  public stepOver() 
  {
    this.stepTo(this.current.stepOver);
  }

  public stepOut() 
  {
    this.stepTo(this.current.stepOut);
  }

  public stepToBreakpoint() 
  {
    const start = this.current.step;

    if (this.breakpoints.has(this.current.stepDebug.expr)) 
    {
      this.stepTo(start + 1, this.breakpoints);

      if (!this.breakpoints.has(this.current.stepDebug.expr)) 
      {
        this.last();
      }
    } 
    else 
    {
      this.stepTo(start, this.breakpoints);

      if (this.current.step === start) 
      {
        this.last();
      }
    }
  }

}

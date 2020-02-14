import { Type, Expression, AliasedType, Traverser, InvokeExpression } from 'expangine-runtime';
import { EventBase } from './EventBase';
import { TypeSettings } from '@/runtime/types/TypeVisuals';


export interface SystemProgram
{
  program: Expression;
  type: Type;
  data?: any;
  settings?: TypeSettings;
  onChange?: (changed: { program?: Expression, type?: Type, data?: any, settings?: TypeSettings }) => void;
}

export interface SystemEvent
{
  replaceData: (data: any) => void;
  loading: (loadable: () => Promise<any>) => void;
  setType: (name: string, type: Type, settings: TypeSettings<any>, data: any[]) => void;
  getPrograms: () => SystemProgram[];
}

export class SystemClass extends EventBase<SystemEvent> 
{ 

  public getPrograms(): SystemProgram[]
  {
    const listeners = this.trigger('getPrograms');

    return listeners.reduce((all, subset) => all.concat(subset), []);
  }

  public getAliasReferences(name?: string, withData: boolean = false): Array<[AliasedType, SystemProgram]>
  {
    const refs: Array<[AliasedType, SystemProgram]> = [];

    this.getPrograms().forEach((program) =>
    {
      if (!program.data || !withData)
      {
        return;
      }

      program.type.traverse(new Traverser((inner) =>
      {
        if (inner instanceof AliasedType && (!name || inner.options === name))
        {
          refs.push([inner, program]);
        }
      }));
    });

    return refs;
  }

  public getFunctionReferences(name?: string, arg?: string): Array<[InvokeExpression, SystemProgram]>
  {
    const refs: Array<[InvokeExpression, SystemProgram]> = [];

    this.getPrograms().forEach((program) =>
    {
      program.program.traverse(new Traverser((expr) =>
      {
        if (expr instanceof InvokeExpression && (!name || expr.name === name) && (!arg || arg in expr.args))
        {
          refs.push([expr, program]);
        }
      }));
    });

    return refs;
  }

  public loadable(loader: () => Promise<any>): void
  {
    if (this.hasListeners('loading'))
    {
      this.trigger('loading', loader);
    }
    else
    {
      loader();
    }
  }
  
}

export const System = new SystemClass();

import Vue from 'vue';
import { Traverser, GetRelationExpression, GetTypeExpression, AliasedType, Expression, InvokeExpression } from 'expangine-runtime';
import { System, SystemProgram } from './SystemEvents';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';

export const refactor = {
  confirm: false,
};

export async function renameRelationReferences(oldName: string, newName: string, confirm: boolean = refactor.confirm)
{
  const foundGetRelation: Array<[
    GetRelationExpression, 
    SystemProgram['onChange'],
    SystemProgram['program'],
  ]> = [];
  
  System.getPrograms().forEach(({ program, onChange }) =>
  {
    program.traverse(new Traverser((expr) => 
    {
      if (expr instanceof GetRelationExpression && expr.name === oldName) 
      {
        foundGetRelation.push([expr, onChange, program]);
      }
    }));
  });

  if (foundGetRelation.length > 0 && (!confirm || await getConfirmation({ message: `Update ${foundGetRelation.length} reference(s) to the relation?` })))
  {
    foundGetRelation.forEach(([expr, onChange, program]) =>
    {
      expr.name = newName;

      if (onChange)
      {
        onChange({ program });
      }
    });
  }
}

export async function renameAliasedReferences(oldName: string, newName: string, confirm: boolean = refactor.confirm)
{
  const foundGetType: Array<[
    GetTypeExpression, 
    SystemProgram['onChange'],
    SystemProgram['program'],
  ]> = [];

  const foundAliased = System.getAliasReferences(oldName);

  System.getPrograms().forEach(({ program, type, onChange }) =>
  {
    program.traverse(new Traverser((expr) => 
    {
      if (expr instanceof GetTypeExpression && expr.name === oldName) 
      {
        foundGetType.push([expr, onChange, program]);
      }
    }));
  });

  if (foundGetType.length > 0 && (!confirm || await getConfirmation({ message: `Update ${foundGetType.length} expression reference(s) from ${oldName} to ${newName}?` })))
  {
    foundGetType.forEach(([expr, onChange, program]) =>
    {
      expr.name = newName;

      if (onChange)
      {
        onChange({ program });
      }
    });
  }

  if (foundAliased.length > 0 && (!confirm || await getConfirmation({ message: `Update ${foundAliased.length} type reference(s) from ${oldName} to ${newName}?` })))
  {
    foundAliased.forEach(([aliased, { onChange, type }]) =>
    {
      aliased.options = newName;

      if (onChange)
      {
        onChange({ type });
      }
    });
  }
}

export async function refactorType(name: string, transform: Expression, confirm: boolean = refactor.confirm)
{
  const refs = System.getAliasReferences(name, true);

  if (refs.length > 0 && (!confirm || await getConfirmation({ message: `Update ${refs.length} data reference(s)?` })))
  {
    refs.forEach(([aliased, { onChange, data, type }]) =>
    {
      type.setParent();

      const dataTransform = aliased.getValueChangeAt(transform);

      data = LiveRuntime.run(dataTransform, { value: data });
      
      if (onChange)
      {
        onChange({ data });
      }
    });
  }
}

export async function renameFunction(oldName: string, newName: string, confirm: boolean = refactor.confirm)
{
  const refs = System.getFunctionReferences(oldName);

  if (refs.length > 0 && (!confirm || await getConfirmation({ message: `Update ${refs.length} Invoke expression(s)?` })))
  {
    refs.forEach(([expr, { onChange, program }]) =>
    {
      expr.name = newName;

      if (onChange)
      {
        onChange({ program });
      }
    });
  }
}

export async function renameFunctionArgument(functionName: string, oldName: string, newName: string, confirm: boolean = refactor.confirm)
{
  const refs = System.getFunctionReferences(functionName, oldName);

  if (refs.length > 0 && (!confirm || await getConfirmation({ message: `Update ${refs.length} Invoke expression(s)?` })))
  {
    refs.forEach(([expr, { onChange, program }]) =>
    {
      Vue.set(expr.args, newName, expr.args[oldName]);
      Vue.delete(expr.args, oldName);

      if (onChange)
      {
        onChange({ program });
      }
    });
  }
}

export async function removeFunctionArgument(functionName: string, name: string, confirm: boolean = refactor.confirm)
{
  const refs = System.getFunctionReferences(functionName, name);

  if (refs.length > 0 && (!confirm || await getConfirmation({ message: `Update ${refs.length} Invoke expression(s)?` })))
  {
    refs.forEach(([expr, { onChange, program }]) =>
    {
      Vue.delete(expr.args, name);

      if (onChange)
      {
        onChange({ program });
      }
    });
  }
}

import Vue from 'vue';
import { Traverser, GetRelationExpression, GetTypeExpression, AliasedType, Expression, InvokeExpression } from 'expangine-runtime';
import { System, SystemProgram } from './SystemEvents';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';
import { Preferences } from './Preference';


const PREF_REFACTOR_RENAME_RELATION = Preferences.define({
  key: 'refactor_rename_relation',
  label: 'Rename relation references when relation name changes without confirmation',
  defaultValue: true,
});

const PREF_REFACTOR_RENAME_TYPE_EXPRESSIONS = Preferences.define({
  key: 'refactor_rename_type_expressions',
  label: 'Rename type expressions when type name changes without confirmation',
  defaultValue: true,
});

const PREF_REFACTOR_RENAME_TYPE_TYPES = Preferences.define({
  key: 'refactor_rename_type_types',
  label: 'Update user-defined type references without confirmation',
  defaultValue: true,
});

const PREF_REFACTOR_TYPE = Preferences.define({
  key: 'refactor_type',
  label: 'Update user-defined type data without confirmation',
  defaultValue: true,
});

const PREF_REFACTOR_RENAME_FUNCTION = Preferences.define({
  key: 'refactor_rename_function',
  label: 'Update invoke expressions when function renamed without confirmation',
  defaultValue: true,
});

const PREF_REFACTOR_RENAME_FUNCTION_ARGUMENT = Preferences.define({
  key: 'refactor_rename_function_argument',
  label: 'Update invoke expressions when function argument renamed without confirmation',
  defaultValue: true,
});

const PREF_REFACTOR_REMOVE_FUNCTION_ARGUMENT = Preferences.define({
  key: 'refactor_remove_function_argument',
  label: 'Update invoke expressions when function argument removed without confirmation',
  defaultValue: true,
});


export async function renameRelationReferences(oldName: string, newName: string)
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

  if (foundGetRelation.length > 0 && await getConfirmation({ message: `Update ${foundGetRelation.length} reference(s) to the relation?`, pref: PREF_REFACTOR_RENAME_RELATION }))
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

export async function renameAliasedReferences(oldName: string, newName: string)
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

  if (foundGetType.length > 0 && await getConfirmation({ message: `Update ${foundGetType.length} expression reference(s) from ${oldName} to ${newName}?`, pref: PREF_REFACTOR_RENAME_TYPE_EXPRESSIONS }))
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

  if (foundAliased.length > 0 && await getConfirmation({ message: `Update ${foundAliased.length} type reference(s) from ${oldName} to ${newName}?`, pref: PREF_REFACTOR_RENAME_TYPE_TYPES }))
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

export async function refactorType(name: string, transform: Expression)
{
  const refs = System.getAliasReferences(name, true);

  if (refs.length > 0 && await getConfirmation({ message: `Update ${refs.length} data reference(s)?`, pref: PREF_REFACTOR_TYPE }))
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

export async function renameFunction(oldName: string, newName: string)
{
  const refs = System.getFunctionReferences(oldName);

  if (refs.length > 0 && await getConfirmation({ message: `Update ${refs.length} Invoke expression(s)?`, pref: PREF_REFACTOR_RENAME_FUNCTION }))
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

export async function renameFunctionArgument(functionName: string, oldName: string, newName: string)
{
  const refs = System.getFunctionReferences(functionName, oldName);

  if (refs.length > 0 && await getConfirmation({ message: `Update ${refs.length} Invoke expression(s)?`, pref: PREF_REFACTOR_RENAME_FUNCTION_ARGUMENT }))
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

export async function removeFunctionArgument(functionName: string, name: string)
{
  const refs = System.getFunctionReferences(functionName, name);

  if (refs.length > 0 && await getConfirmation({ message: `Update ${refs.length} Invoke expression(s)?`, pref: PREF_REFACTOR_REMOVE_FUNCTION_ARGUMENT }))
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

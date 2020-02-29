import { DefinitionsReferenceSource, Program, Entity, ProgramDataSet, EntityTranscoder, Func, FuncTest, Relation, ReferenceData, Expression, Type, isArray } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';

export function getSourceName(source: DefinitionsReferenceSource)
{
  if (source instanceof Program)
  {
    return `Program [${source.name}]`;
  }
  if (source instanceof Entity)
  {
    return `Type [${source.name}]`;
  }
  if (source instanceof Func)
  {
    return `Function [${source.name}]`;
  }
  if (source instanceof Relation)
  {
    return `Relation [${source.name}]`;
  }
  if (source instanceof ReferenceData)
  {
    return `Data [${source.name}]`;
  }
  if (source.length === 2)
  {
    if (source[0] instanceof Program)
    {
      return `Program [${source[0].name}] Input`;
    }
    if (source[0] instanceof Entity)
    {
      if (source[1] instanceof Func)
      {
        return `Entity [${source[0].name}] Method [${source[1].name}]`;
      }
      else if (source[1] === 'key')
      {
        return `Entity [${source[0].name}] Primary Key`;
      }
      else if (source[1] === 'describe')
      {
        return `Entity [${source[0].name}] Describe`;
      }
    }
    if (source[0] instanceof Func)
    {
      if (source[1] === 'params')
      {
        return `Function [${source[0].name}] Parameters`;
      }
      if (source[1] === 'returnType')
      {
        return `Function [${source[0].name}] Return Type`;
      }
    }
  }
  if (source.length === 3)
  {
    if (source[0] instanceof Entity)
    {
      if (source[1] instanceof Func)
      {
        if (source[2] === 'params')
        {
          return `Entity [${source[0].name}] Method [${source[1].name}] Parameters`;
        }
        if (source[2] === 'returnType')
        {
          return `Entity [${source[0].name}] Method [${source[1].name}] Return Type`;
        }
      }
      
      return `Entity [${source[0].name}] Transcoder for [${source[1]}]`;
    }
    if (source[0] instanceof Func) 
    {
      if (source[2] === 'args')
      {
        return `Function [${source[0].name}] Unit Test [${source[1].name}] Inputs`;
      }
      if (source[2] === 'expected')
      {
        return `Function [${source[0].name}] Unit Test [${source[1].name}] Expected`;
      }
    }
  }
  if (source.length === 4)
  {
    if (source[1] instanceof Func)
    {
      if (source[3] === 'args')
      {
        return `Entity [${source[0].name}] Method [${source[1].name}] Unit Test [${source[2].name}] Inputs`;
      }
      if (source[3] === 'expected')
      {
        return `Entity [${source[0].name}] Method [${source[1].name}] Unit Test [${source[2].name}] Expected`;
      }
    }

    if (source[3] === 'encode')
    {
      return `Entity [${source[0].name}] [${source[1]}] Transcoder Encode`;
    }
    if (source[3] === 'decode')
    {
      return `Entity [${source[0].name}] [${source[1]}] Transcoder Decode`;
    }
  }

  return '';
}

export function getSource(source: DefinitionsReferenceSource)
{
  return isArray(source) ? source[0] : source;
}

export function getIcon(source: DefinitionsReferenceSource): string
{
  const type = getSource(source);

  if (type instanceof Program)
  {
    return 'mdi-code-braces';
  }
  if (type instanceof ReferenceData)
  {
    return 'mdi-database';
  }
  if (type instanceof Func)
  {
    return 'mdi-function';
  }
  if (type instanceof Entity)
  {
    return 'mdi-cube-outline';
  }
  if (type instanceof Relation)
  {
    return 'mdi-axis-arrow';
  }

  return '';
}

export function getTypePath(registry: Registry, type: Type, root: Type): string[]
{
  const path: string[] = [];

  root.setParent();

  while (type)
  {
    const visuals = registry.getTypeVisuals(type, false);

    if (visuals)
    {
      path.push(visuals.name);
    }

    type = type.parent;
  }

  return path.reverse();
}

export function getExpressionPath(registry: Registry, expr: Expression, root: Expression): string[]
{
  const path: string[] = [];

  root.setParent();

  while (expr)
  {
    const visuals = registry.getExpressionVisuals(expr);

    if (visuals)
    {
      path.push(visuals.name);
    }

    expr = expr.parent;
  }

  return path.reverse();
}


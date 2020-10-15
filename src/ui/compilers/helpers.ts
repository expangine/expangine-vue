import { DefinitionProvider, isArray, isObject, Type, Validation } from 'expangine-runtime';

export function validateAny(value: any, def: DefinitionProvider, context: Type, out: Validation[])
{
  if (def.isExpression(value)) 
  {
    const attrExp = def.getExpression(value);

    attrExp.validate(def, context, (v) => out.push(v));
  }
}

export function validateRecord(record: Record<string, any> | undefined, def: DefinitionProvider, context: Type, out: Validation[])
{
  if (record) 
  {
    for (const prop in record) 
    {
      validateAny(record[prop], def, context, out);
    }
  }
}

export function validateArray(arr: any[] | undefined, def: DefinitionProvider, context: Type, out: Validation[])
{
  if (arr) 
  {
    for (const item of arr) 
    {
      validateAny(item, def, context, out);
    }
  }
}

export function validateChildren(children: any, def: DefinitionProvider, context: Type, out: Validation[])
{
  if (isArray(children)) 
  {
    validateArray(children, def, context, out);
  }
  else if (isObject(children))
  {
    for (const slotName in children)
    {
      validateChildren(children[slotName], def, context, out);
    }
  }
}

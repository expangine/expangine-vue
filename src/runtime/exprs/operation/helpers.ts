
import { OperationPair, isArray, OperationMapping } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';


export function filterOperation(item: any, queryText: string, itemText: string) 
{
  if (isArray(item.tokens)) 
  {
    const queryTokens = getTokens(queryText);

    return queryTokens.some((queryToken) => item.tokens.some((token: string) => token.indexOf(queryToken) !== -1));
  }
  else 
  {
    return itemText.toLowerCase().indexOf(queryText.toLowerCase()) !== -1;
  }
}

export function getToken(text: string): string 
{
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getTokens(text: string): string[] 
{ 
  return text.split(/\s+/).map(getToken).filter((token) => !!token);
}

export function getListOption(registry: Registry, value: OperationPair) 
{
  const { name: text, description, keywords } = registry.getOperationVisuals(value.op.id);

  const tokens = getTokens(text)
    .concat(getTokens(description))
    .concat(keywords ? keywords.map(getToken) : []);

  return { 
    text,
    description,
    value,
    tokens,
  };
}

export function getMappingListOption(registry: Registry, value: OperationMapping)
{
  const { text, description: defaultDescription, tokens } = getListOption(registry, { op: value.to, types: value.toTypes });
  const description = value.unmapped.length > 0
    ? defaultDescription + ': <strong>' + value.unmapped.join(', ') + '</strong> will be lost'
    : defaultDescription;

  return { text, description, tokens, value };
}


export function sortMappingListOption(a: {text: string, value: OperationMapping}, b: {text: string, value: OperationMapping}): number 
{
  return (a.value.unmapped.length - b.value.unmapped.length) || a.text.localeCompare(b.text);
}

export function sortListOption(a: {text: string}, b: {text: string}): number 
{
  return a.text.localeCompare(b.text);
}

export function sortListOptionByCount(query: string)
{
  const tokens = getTokens(query);
  const countCache: Record<string, number> = {};
  const getCount = (otherTokens: string[]): number => 
  {
    const key = otherTokens.join(',');
    if (countCache[key]) 
    {
      return countCache[key];
    }

    let count = 0;
    for (const currentToken of tokens) 
    {
      if (otherTokens.indexOf(currentToken) !== -1) 
      {
        count++;
      }
    }

    return countCache[key] = count;
  };

  return (a: {text: string, tokens: string[]}, b: {text: string, tokens: string[]}) => 
  {
    const d = getCount(b.tokens) - getCount(a.tokens);

    return d === 0 ? sortListOption(a, b) : d;
  };
}

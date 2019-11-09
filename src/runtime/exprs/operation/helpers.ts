
import { OperationPair, OperationMapping } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';
import { Trie } from '@/app/Trie';


export function filterOperation(item: any, queryText: string, itemText: string) 
{
  if (item.tokens instanceof Trie) 
  {
    const queryTokens = getTokens(queryText);

    return getTrieScoreFromList(item.tokens, queryTokens) > 0;
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

export function getTrieFromList(tokenList: string[], defaultWeight: number = 1): Trie<number>
{
  const tokens = new Trie<number>();

  tokenList.forEach((token) => tokens.set(token, defaultWeight));

  return tokens;
}

export function getListOption(registry: Registry, value: OperationPair) 
{
  const { name: text, description, keywords, weight } = registry.getOperationVisuals(value.op.id);

  const tokenList = getTokens(text)
    .concat(getTokens(description))
    .concat(keywords ? keywords.map(getToken) : []);

  const tokens = getTrieFromList(tokenList, weight || 1);

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
  const queryTokens = getTokens(query);

  return (a: {text: string, tokens: Trie<number>}, b: {text: string, tokens: Trie<number>}) => 
  {
    return getTrieScoreFromList(b.tokens, queryTokens) - getTrieScoreFromList(a.tokens, queryTokens);
  };
}

export function getTrieScoreFromList(trie: Trie<number>, textList: string[]): number
{
  return textList.reduce((sum, text) => sum + getTrieScore(trie, text), 0);
}

export function getTrieScore(trie: Trie<number>, text: string): number
{
  let score = 0;

  trie.match(text, 1, 10000, (occurrences, key, amount) => score += 1 / amount * occurrences);

  return score;
}

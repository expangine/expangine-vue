

export interface ExplorerTab
{
  id: string;
  name: string;
  icon: string;
  close: () => void;
  component: string;
  bind: Record<string, any>;
  on: Record<string, (...args: any[]) => any>;
}

export function isNameVisible(name: string, filter: string | null): boolean
{
  const filterTokenized = filter ? tokenize(filter) : '';

  return !filterTokenized || tokenize(name).indexOf(filterTokenized) !== -1;
}

export function tokenize(x: string)
{
  return x.replace(/[^\w\d]/g, '').toLowerCase();
}

import { objectToArray, NamedMap, Named } from 'expangine-runtime';


export type ExplorerSorterFunc<T> = (a: T, b: T) => number;

export type ExplorerSorterOptions<T> = Record<string, ExplorerSorterFunc<T>>;

export const ICONS = ['mdi-arrow-up', 'mdi-checkbox-blank-circle-outline', 'mdi-arrow-down'];

export class ExplorerSorter<T extends Named>
{

    public sorting: NamedMap<T>;
    public sorters: ExplorerSorterOptions<T>;
    public labels: string[];

    public constructor(sorting: NamedMap<T>, sorters: ExplorerSorterOptions<T>)
    {
        this.sorting = sorting;
        this.sorters = sorters;
        this.labels = objectToArray(sorters, (_, k) => k);
    }

    public isSortable(): boolean
    {
        return this.sorting.values.length > 1;
    }

    public getSortSign(prop: string): -1 | 0 | 1
    {
        const values: T[] = this.sorting.values;

        if (values.length < 2)
        {
            return 0;
        }

        let less = 0;
        let more = 0;

        for (let i = 1; i < values.length; i++)
        {
            const cmp = this.sorters[prop](values[i - 1], values[i]);

            if (cmp < 0) 
            {
                less++;
            }
            if (cmp > 0) 
            {
                more++;
            }
        }

        return (less === 0) === (more === 0) ? 0 : less > 0 ? -1 : 1;
    }

    public getSortIcon(prop: string): string
    {
        return ICONS[this.getSortSign(prop) + 1];
    }

    public sortBy(prop: string): void
    {
        const current = this.getSortSign(prop);
        const reversed = current === -1;
        const sorter = this.sorters[prop];

        this.sorting.sort(reversed ? (a, b) => sorter(b, a) : sorter);
    }
    
}

import { Expression, NoExpression } from 'expangine-runtime';


export function ifExpr<T = string>(expr: Expression | null | undefined, truthy: T, falsy: T = '' as any): T
{
    return expr && expr !== NoExpression.instance ? truthy : falsy;
}

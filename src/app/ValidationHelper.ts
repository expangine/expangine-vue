import { ValidationSeverity, ValidationType, Validation, OperationExpression } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';

export class ValidationHelper
{

  public static ICONS: Record<ValidationSeverity, string> = {
    [ValidationSeverity.LOW]: 'mdi-information-outline',
    [ValidationSeverity.MEDIUM]: 'mdi-alert-outline',
    [ValidationSeverity.HIGH]: 'mdi-alert-circle',
  };

  public static COLORS: Record<ValidationSeverity, string> = {
    [ValidationSeverity.LOW]: 'amber--text text--lighten-2',
    [ValidationSeverity.MEDIUM]: 'orange--text text--darken-1',
    [ValidationSeverity.HIGH]: 'red--text text--darken-2',
  };

  public static COLORS_BACKGROUND: Record<ValidationSeverity, string> = {
    [ValidationSeverity.LOW]: 'amber lighten-2',
    [ValidationSeverity.MEDIUM]: 'orange darken-1',
    [ValidationSeverity.HIGH]: 'red darken-2',
  };

  public static getDescription({ type, severity, subject, parent, context, expected, actual }: Validation, registry: Registry)
  {
    const subjectName = subject ? registry.getExpressionName(subject) : 'expression';
    const parentName = parent ? registry.getExpressionName(parent) : 'the parent expression';
    const expectedName = expected ? registry.getTypeVisuals(expected).name : 'type';
    const actualName = actual ? registry.getTypeVisuals(actual).name : 'type';

    switch (type) {
      case ValidationType.UNSAFE_OPERATION:
        return `The ${subjectName} is not safe.`;
      case ValidationType.POSSIBLY_NULL:
        return `The ${subjectName} may return an undefined value and ${parentName} expects a defined value.`;
      case ValidationType.INCOMPATIBLE_TYPES:
        if (severity === ValidationSeverity.MEDIUM) {
          return `The returned ${actualName} is not fully compatible with the expected ${expectedName}`;
        } else {
          return `The returned ${actualName} is not compatible with the expected ${expectedName}`;
        }
      case ValidationType.INVALID_EXPRESSION:
        return 'The expression is not valid.';
      case ValidationType.MISSING_EXPRESSION:
        return 'The expression is missing.';
      case ValidationType.MISSING_FUNCTION:
        return 'The function does not exist.';
      case ValidationType.MISSING_OPERATION:
        const operationName = subject instanceof OperationExpression ? subject.name : '';
        if (operationName) {
          return `The operation "${operationName}" does not exist.`;
        } else {
          return `The operation expression does not have an operation specified.`;
        }
    }

    return 'An unknown error has occurred.';
  }

}

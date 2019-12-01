
import { getPromiser } from './Promiser';
import { Expression, Type, NoExpression, ObjectType } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';

export interface GetProgramOptions
{
  title: string;
  message: string;
  registry: Registry;
  context: Type;
  program: Expression;
  expectedType: Type | null;
  removeDescribedRestrictions: boolean;
  programLabel: string;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  close: (confirmed: boolean) => void;
}

export function getGetProgramDefaults(): GetProgramOptions {
  return {
    title: 'Program',
    message: '',
    registry: null as unknown as Registry,
    context: ObjectType.baseType,
    program: NoExpression.instance,
    expectedType: null,
    removeDescribedRestrictions: true,
    programLabel: 'Program',
    confirm: 'OK',
    unconfirm: 'Cancel',
    visible: false,
    close: () => { /* */ },
  };
}

export const getProgramDialog = getGetProgramDefaults();

export type GetProgramResult = { program: Expression, returnType: Type | null } | false;

export async function getProgram(options: Partial<GetProgramOptions> = {}): Promise<GetProgramResult> 
{
  const { resolve, promise } = getPromiser<GetProgramResult>();

  Object.assign(getProgramDialog, getGetProgramDefaults());
  Object.assign(getProgramDialog, options);

  getProgramDialog.visible = true;
  getProgramDialog.close = (confirmed: boolean) => {
    const { program, registry, context, expectedType, removeDescribedRestrictions } = getProgramDialog;

    getProgramDialog.visible = false;

    if (!confirmed) {
      resolve(false);
    } else {
      const returnType = expectedType
        ? expectedType
        : program.getType(registry.defs, context);

      if (returnType && !expectedType && removeDescribedRestrictions) {
        returnType.removeDescribedRestrictions();
      }

      resolve({ program, returnType });
    }
  };

  return promise;
}
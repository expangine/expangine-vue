
import { Expression, ExpressionMap, TypeMap, objectEach, isOperationTypeFunction, OptionalType, ObjectType, Type, Exprs } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettingsAny } from '@/runtime/types/TypeVisuals';


export interface TestProgramOptions
{
  title: string;
  description: string;
  inputType: Type;
  input: any;
  program: Expression;
  visible: boolean;
  fullscreen: boolean;
  resultAutomatic: boolean;
  result: any;
  invalid: boolean;
  registry: Registry;
  close: (result: any) => any;
}

export function getTestProgramDefaults(): TestProgramOptions
{
  return {
    title: 'Test Program',
    description: '',
    inputType: ObjectType.from(),
    input: {},
    program: Exprs.noop(),
    resultAutomatic: true,
    result: null,
    visible: false,
    fullscreen: false,
    invalid: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const testProgramDialog = getTestProgramDefaults();

export type TestProgramResult = any;


export async function getTestProgram(options: Partial<TestProgramOptions> = {}): Promise<TestProgramResult>
{
  const { resolve, promise } = getPromiser<TestProgramResult>();

  Object.assign(testProgramDialog, getTestProgramDefaults());
  Object.assign(testProgramDialog, options);

  testProgramDialog.input = testProgramDialog.inputType.create();
  testProgramDialog.visible = true;

  testProgramDialog.close = (save) => {
    resolve();
    testProgramDialog.visible = false;
  };

  return promise;
}

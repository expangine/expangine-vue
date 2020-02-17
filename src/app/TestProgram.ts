
import { Expression, ObjectType, Type, Exprs } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_TEST_PROGRAM = Preferences.define({
  key: 'fullscreen_test_program',
  label: 'Test program dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});


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
    fullscreen: Preferences.get(PREF_FULLSCREEN_TEST_PROGRAM),
    invalid: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const testProgramDialog = getTestProgramDefaults();

export const testProgramMultiplier = getMultipleDialoger(testProgramDialog);

export type TestProgramResult = any;


export async function getTestProgram(options: Partial<TestProgramOptions> = {}): Promise<TestProgramResult>
{
  const { resolve, promise } = getPromiser<TestProgramResult>();

  testProgramMultiplier.open(() => 
  {
    Object.assign(testProgramDialog, getTestProgramDefaults());
    Object.assign(testProgramDialog, options);

    testProgramDialog.input = testProgramDialog.inputType.create();

    testProgramDialog.close = (save) => 
    {
      resolve();

      testProgramMultiplier.close();
    };
  });

  return promise;
}

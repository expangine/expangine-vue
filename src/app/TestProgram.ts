
import { Expression, Type, Exprs, Types } from 'expangine-runtime';
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
  program: Expression;
  visible: boolean;
  fullscreen: boolean;
  resultAutomatic: boolean;
  registry: Registry;
  close: (result: any) => any;
}

export function getTestProgramDefaults(): TestProgramOptions
{
  return {
    title: 'Test Program',
    description: '',
    inputType: Types.object(),
    program: Exprs.noop(),
    resultAutomatic: true,
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_TEST_PROGRAM),
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

    testProgramDialog.close = (save) => 
    {
      resolve();

      testProgramMultiplier.close();
    };
  });

  return promise;
}

import { PreferenceCategory, Preferences } from './Preference';
import { Func, FuncTest } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';
import { getPromiser } from './Promiser';


export const PREF_FULLSCREEN_FUNC_TEST = Preferences.define({
  key: 'fullscreen_func_test',
  label: 'Function Unit Test dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});

export interface FuncTestOptions
{
  func: Func;
  test: FuncTest;
  actualString: string;
  expectedString: string;
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: (saved: boolean) => any;
}

export function getFuncTestDefaults(): FuncTestOptions
{
  return {
    func: null as any,
    test: null as any,
    actualString: '',
    expectedString: '',
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_FUNC_TEST),
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const funcTestDialog = getFuncTestDefaults();

export type FuncTestResult = FuncTest | false;

export async function getFuncTest(options: Partial<FuncTestOptions> = {}): Promise<FuncTestResult>
{
  const { resolve, promise } = getPromiser<FuncTestResult>();

  Object.assign(funcTestDialog, getFuncTestDefaults());
  Object.assign(funcTestDialog, options);

  funcTestDialog.visible = true;
  funcTestDialog.close = (saved) => {
    resolve(saved ? funcTestDialog.test : false);

    funcTestDialog.visible = false;
  };

  return promise;
}

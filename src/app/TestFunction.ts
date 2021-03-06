
import { Func, AnyType, ObjectType, NoExpression } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_TEST_FUNCTION = Preferences.define({
  key: 'fullscreen_test_function',
  label: 'Test function dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});


export interface TestFunctionOptions
{
  title: string;
  name: string;
  func: Func;
  params: ObjectType;
  settings: TypeSettings;
  data: any;
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: (save: boolean) => any;
}

export function getTestFunctionDefaults(): TestFunctionOptions
{
  return {
    title: 'Test Function',
    name: '',
    func: null as unknown as Func,
    params: ObjectType.baseType,
    settings: { input: 'form', options: {}, defaultValue: {} },
    data: null,
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_TEST_FUNCTION),
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const testFunctionDialog = getTestFunctionDefaults();

export const testFunctionMultiplier = getMultipleDialoger(testFunctionDialog);

export type TestFunctionResult = void;


export async function getTestFunction(options: Partial<TestFunctionOptions> = {}): Promise<TestFunctionResult>
{
  const { resolve, promise } = getPromiser<TestFunctionResult>();

  testFunctionMultiplier.open(() =>
  {
    Object.assign(testFunctionDialog, getTestFunctionDefaults());
    Object.assign(testFunctionDialog, options);

    const { registry, name } = testFunctionDialog;

    testFunctionDialog.func = (name ? registry.defs.getFunction(name) : null) || Func.create(registry.defs);
    testFunctionDialog.func.params.setParent();
    testFunctionDialog.params = testFunctionDialog.func.params;
    testFunctionDialog.settings = registry.getTypeSettings(testFunctionDialog.params);
    testFunctionDialog.data = testFunctionDialog.params.create(); 

    testFunctionDialog.close = (save) => 
    {
      resolve();

      testFunctionMultiplier.close();
    };
  });

  return promise;
}

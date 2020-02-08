
import { FunctionType, AnyType, ObjectType, NoExpression } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { getMultipleDialoger } from './MultipleDialog';


export interface TestFunctionOptions
{
  title: string;
  name: string;
  func: FunctionType;
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
    func: new FunctionType({
      returnType: new AnyType({ }),
      params: new ObjectType({ props: {} }),
      expression: NoExpression.instance,
    }),
    params: ObjectType.baseType,
    settings: { input: 'form', options: {}, defaultValue: {} },
    data: null,
    visible: false,
    fullscreen: false,
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

    testFunctionDialog.func = name ? registry.defs.getFunction(name) : testFunctionDialog.func;
    testFunctionDialog.func.setParent();
    testFunctionDialog.params = testFunctionDialog.func.options.params;
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

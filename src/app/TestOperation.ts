
import { OperationGeneric, OperationTypes, ExpressionMap, TypeMap, objectEach, isOperationTypeFunction, ExpressionBuilder, NoExpression, OptionalType, ObjectType, Type, Exprs } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettingsAny } from '@/runtime/types/TypeVisuals';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences } from './Preference';


export const PREF_FULLSCREEN_TEST_OPERATION = Preferences.define({
  key: 'fullscreen_test_operation',
  label: 'Test operation dialog is fullscreen when opened',
  defaultValue: false,
});


export interface TestOperationOptions
{
  name: string;
  context: Type;
  op: OperationGeneric | null;
  types: OperationTypes<any, any, any> | null;
  paramNames: string[];
  paramsConstant: TypeMap;
  paramsSettings: Record<string, TypeSettingsAny>;
  params: ExpressionMap;
  visible: boolean;
  fullscreen: boolean;
  resultAutomatic: boolean;
  result: any;
  invalid: boolean;
  registry: Registry;
  close: (result: any) => any;
}

export function getTestOperationDefaults(): TestOperationOptions
{
  return {
    name: '',
    context: ObjectType.from(),
    op: null,
    types: null,
    paramNames: [],
    paramsConstant: {},
    paramsSettings: {},
    params: {},
    resultAutomatic: true,
    result: null,
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_TEST_OPERATION),
    invalid: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const testOperationDialog = getTestOperationDefaults();

export const testOperationMultiplier = getMultipleDialoger(testOperationDialog);

export type TestOperationResult = any;


export async function getTestOperation(options: Partial<TestOperationOptions> = {}): Promise<TestOperationResult>
{
  const { resolve, promise } = getPromiser<TestOperationResult>();

  testOperationMultiplier.open(() =>
  {
    Object.assign(testOperationDialog, getTestOperationDefaults());
    Object.assign(testOperationDialog, options);

    const { registry, name } = testOperationDialog;

    const op = registry.defs.getOperation(name);
    const types = registry.defs.getOperationTypes(name);

    if (!op || !types) 
    {
      resolve();

      return false;
    }

    const params: ExpressionMap = {};
    const constants: TypeMap = {};
    const settings: Record<string, TypeSettingsAny> = {};
    const combined = {
      ...types.params,
      ...types.optional,
    };

    objectEach(combined, (typeInput, key) => {
      if (!isOperationTypeFunction(typeInput) && op.hasScope.indexOf(key) === -1) {
        let detected = registry.defs.getOperationInputType(typeInput);
        if (detected) {
          if (!detected.isOptional() && op.optional.indexOf(key) !== -1) {
            detected = OptionalType.for(detected);
          }
          constants[key] = detected;
          settings[key] = registry.getTypeSettings(detected);
          params[key] = detected.isOptional() ? Exprs.noop() : Exprs.const(detected.create());
        } else {
          params[key] = Exprs.noop();
        }
      } else {
        params[key] = Exprs.noop();
      }
    });

    testOperationDialog.op = op;
    testOperationDialog.paramNames = op.params.concat(op.optional);
    testOperationDialog.paramsConstant = constants;
    testOperationDialog.paramsSettings = settings;
    testOperationDialog.params = params;
    testOperationDialog.types = types;

    testOperationDialog.close = (save) => 
    {
      resolve();

      testOperationMultiplier.close();
    };
  });
  

  return promise;
}

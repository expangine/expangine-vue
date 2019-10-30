
import { OperationGeneric, OperationTypes, ExpressionMap, TypeMap, objectEach, isOperationTypeFunction, ExpressionBuilder, NoExpression, OptionalType, ObjectType, Type } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettingsAny } from '@/runtime/types/TypeVisuals';


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
    result: null,
    visible: false,
    invalid: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const testOperationDialog = getTestOperationDefaults();

export type TestOperationResult = any;


export async function getTestOperation(options: Partial<TestOperationOptions> = {}): Promise<TestOperationResult>
{
  const { resolve, promise } = getPromiser<TestOperationResult>();

  Object.assign(testOperationDialog, getTestOperationDefaults());
  Object.assign(testOperationDialog, options);

  const { registry, name } = testOperationDialog;

  const op = registry.defs.getOperation(name);
  const types = registry.defs.getOperationTypes(name);

  if (!op || !types) {
    resolve();

    return promise;
  }

  const ex = new ExpressionBuilder();
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
        params[key] = detected.isOptional() ? ex.noop() : ex.const(detected.create());
      } else {
        params[key] = ex.noop();
      }
    } else {
      params[key] = ex.noop();
    }
  });

  testOperationDialog.op = op;
  testOperationDialog.paramNames = op.params.concat(op.optional);
  testOperationDialog.paramsConstant = constants;
  testOperationDialog.paramsSettings = settings;
  testOperationDialog.params = params;
  testOperationDialog.types = types;
  testOperationDialog.visible = true;

  testOperationDialog.close = (save) => {
    resolve();
    testOperationDialog.visible = false;
  };

  return promise;
}

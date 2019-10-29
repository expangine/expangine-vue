
import Vue from 'vue';
import { Type, FunctionType, AnyType, ObjectType, NoExpression } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettings } from '@/runtime/types/TypeVisuals';


export interface EditFunctionOptions
{
  name: string;
  saveAs: string;
  func: FunctionType;
  requiredParamsType: Type;
  settings: TypeSettings;
  visible: boolean;
  registry: Registry;
  close: (save: boolean) => any;
}

export function getEditFunctionDefaults(): EditFunctionOptions
{
  return {
    name: '',
    saveAs: '',
    func: new FunctionType({
      returnType: new AnyType({ }),
      params: new ObjectType({ props: {} }),
      expression: NoExpression.instance,
    }),
    requiredParamsType: ObjectType.baseType,
    settings: null as unknown as TypeSettings,
    visible: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const editFunctionDialog = getEditFunctionDefaults();

export type EditFunctionResult = FunctionType | false;


export async function getEditFunction(options: Partial<EditFunctionOptions> = {}): Promise<EditFunctionResult>
{
  const { resolve, promise } = getPromiser<EditFunctionResult>();

  Object.assign(editFunctionDialog, getEditFunctionDefaults());
  Object.assign(editFunctionDialog, options);

  const { registry, name } = editFunctionDialog;

  editFunctionDialog.saveAs = name;
  editFunctionDialog.func = name ? registry.defs.getFunction(name) : editFunctionDialog.func;
  editFunctionDialog.settings = registry.getTypeSettings(editFunctionDialog.func.options.params);
  editFunctionDialog.visible = true;
  editFunctionDialog.func.setParent();

  editFunctionDialog.close = (save) => {
    const { saveAs, func } = editFunctionDialog;
    if (save && saveAs) {
      const returnType = func.options.expression.getType(registry.defs, func.options.params);

      func.options.returnType = returnType || new AnyType({ });

      Vue.delete(registry.defs.functions, name);
      Vue.set(registry.defs.functions, saveAs, func);

      resolve(func);
    } else {
      resolve(false);
    }
    editFunctionDialog.visible = false;
  };

  return promise;
}

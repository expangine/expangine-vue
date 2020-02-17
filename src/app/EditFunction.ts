
import Vue from 'vue';
import { Type, FunctionType, AnyType, ObjectType, NoExpression, defs, Types } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { getMultipleDialoger } from './MultipleDialog';
import { renameFunction } from './Refactor';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_EDIT_FUNCTION = Preferences.define({
  key: 'fullscreen_edit_function',
  label: 'Edit function dialog is fullscreen when opened',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export interface EditFunctionOptions
{
  name: string;
  saveAs: string;
  func: FunctionType;
  requiredParamsType: Type;
  settings: TypeSettings;
  visible: boolean;
  fullscreen: boolean;
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
    fullscreen: Preferences.get(PREF_FULLSCREEN_EDIT_FUNCTION),
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const editFunctionDialog = getEditFunctionDefaults();

export const editFunctionMultiplier = getMultipleDialoger(editFunctionDialog);

export type EditFunctionResult = { name: string, function: FunctionType } | false;


export async function getEditFunction(options: Partial<EditFunctionOptions> = {}): Promise<EditFunctionResult>
{
  const { resolve, promise } = getPromiser<EditFunctionResult>();

  editFunctionMultiplier.open(() =>
  {
    Object.assign(editFunctionDialog, getEditFunctionDefaults());
    Object.assign(editFunctionDialog, options);

    const { registry, name } = editFunctionDialog;

    editFunctionDialog.saveAs = name;
    editFunctionDialog.func = name ? registry.defs.getFunction(name) : editFunctionDialog.func;
    editFunctionDialog.settings = registry.getTypeSettings(editFunctionDialog.func.options.params);
    editFunctionDialog.func.setParent();

    editFunctionDialog.close = (save) => 
    {
      const { saveAs, func } = editFunctionDialog;

      if (save && saveAs) 
      {
        const renamed = saveAs !== name && defs.functions[name];

        if (renamed)
        {
          Vue.delete(registry.defs.functions, name);

          renameFunction(name, saveAs);
        }

        const returnType = func.options.expression.getType(registry.defs, func.options.params);

        func.options.returnType = returnType || Types.any();

        Vue.set(registry.defs.functions, saveAs, func);

        resolve({
          name: saveAs,
          function: func,
        });
      } 
      else 
      {
        resolve(false);
      }

      editFunctionMultiplier.close();
    };
  });

  return promise;
}

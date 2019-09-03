
import { asArray } from '@/common';
import { TypeBuildResult, TypeBuildInput, TypeBuildOption, TypeBuilderWrapOption } from '@/runtime/TypeBuilder';
import { OptionalModifierTransform } from '@/runtime/types/optional';
import { getPromiser } from './Promiser';


export interface BuildTypeOptions
{
  input: TypeBuildInput;
  title: string;
  ok: string;
  cancel: string;
  visible: boolean;
  optional: boolean;
  options: TypeBuildOption[];
  types: TypeBuildOption[] | TypeBuildOption | null;
  wrappers: TypeBuilderWrapOption[];
  wrapper: TypeBuilderWrapOption | null;
  handle: (ok: boolean) => void;
}

export function getBuildTypeDefaults(): BuildTypeOptions
{
  return {
    input: null as unknown as TypeBuildInput,
    title: 'Choose Type',
    ok: 'Ok',
    cancel: 'Cancel',
    visible: false,
    optional: false,
    options: [],
    types: [],
    wrappers: [],
    wrapper: null,
    handle: () => { /**/ },
  };
}

export const buildTypeDialog = getBuildTypeDefaults();

export async function getBuildType(options: Partial<BuildTypeOptions> = {}): Promise<TypeBuildResult | false>
{
  const { resolve, promise } = getPromiser<TypeBuildResult | false>();

  Object.assign(buildTypeDialog, getBuildTypeDefaults());
  Object.assign(buildTypeDialog, options);

  const { input } = buildTypeDialog;

  buildTypeDialog.options = input.registry.getTypeBuildersFor(input);
  buildTypeDialog.wrappers = input.registry.getTypeBuilderWrappersFor(input);
  buildTypeDialog.wrapper = buildTypeDialog.wrappers[0];
  buildTypeDialog.visible = true;
  buildTypeDialog.handle = async (ok: boolean) => {
    buildTypeDialog.visible = false;

    const types = asArray(buildTypeDialog.types);

    if (!ok || types.length === 0 || !buildTypeDialog.wrapper) {
      return resolve(false);
    }

    const chosens: TypeBuildResult[] = [];

    for (const type of types) {
      const chosen = await type.value();

      if (chosen) {
        chosens.push(chosen);
      }
    }

    if (chosens.length === 0) {
      return resolve(false);
    }

    const wrapped = await buildTypeDialog.wrapper.value(chosens);

    if (!wrapped) {
      return resolve(false);
    }

    const result = buildTypeDialog.optional
      ? OptionalModifierTransform(wrapped.type, wrapped.settings)
      : wrapped;

    return resolve(result);
  };

  return promise;
}

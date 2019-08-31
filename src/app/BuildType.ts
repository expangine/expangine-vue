
import { TypeBuildResult, TypeBuildInput, TypeBuildOption } from '@/runtime/TypeBuilder';
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
  type: TypeBuildOption | null;
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
    type: null,
    handle: () => { /**/ },
  };
}

export const buildTypeDialog = getBuildTypeDefaults();

export async function getBuildType(options: Partial<BuildTypeOptions> = {}): Promise<TypeBuildResult | false>
{
  const { resolve, promise } = getPromiser<TypeBuildResult | false>();

  Object.assign(buildTypeDialog, getBuildTypeDefaults());
  Object.assign(buildTypeDialog, options);

  buildTypeDialog.visible = true;
  buildTypeDialog.handle = async (ok: boolean) => {
    buildTypeDialog.visible = false;
    if (!ok || !buildTypeDialog.type) {
      return resolve(false);
    }

    const chosen = await buildTypeDialog.type.value();

    if (!chosen) {
      return resolve(false);
    }

    const result = buildTypeDialog.optional
      ? OptionalModifierTransform(chosen.type, chosen.settings)
      : chosen;

    return resolve(result);
  };

  return promise;
}


import { Registry } from '@/runtime/Registry';
import DefaultRegistry from '@/runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { getPromiser } from './Promiser';


export interface BuildTypeOptions
{
  registry: Registry;
  exclude?: Record<string, any>;
  title: string;
  ok: string;
  cancel: string;
  visible: boolean;
  type: TypeVisuals<any, true, any> | null;
  handle: (ok: boolean) => void;
}

export function getBuildTypeDefaults(): BuildTypeOptions
{
  return {
    registry: DefaultRegistry,
    exclude: undefined,
    title: 'Choose Type',
    ok: 'Ok',
    cancel: 'Cancel',
    visible: false,
    type: null,
    handle: () => { /**/ },
  };
}

export const buildTypeDialog = getBuildTypeDefaults();

export async function getBuildType(options: Partial<BuildTypeOptions> = {}): Promise<TypeVisuals<any, true, any> | null>
{
  const { resolve, promise } = getPromiser<TypeVisuals<any, true, any> | null>();

  Object.assign(buildTypeDialog, getBuildTypeDefaults());
  Object.assign(buildTypeDialog, options);

  buildTypeDialog.visible = true;
  buildTypeDialog.handle = (ok: boolean) => {
    buildTypeDialog.visible = false;
    ok ? resolve(buildTypeDialog.type) : resolve(null);
  };

  return promise;
}

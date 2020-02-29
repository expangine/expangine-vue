
import { TypeBuildInput } from '@/runtime/types/TypeBuilder';
import { TypeUpdateEvent } from '@/runtime/types/TypeVisuals';
import { getPromiser } from './Promiser';


export interface BuildTypeOptions
{
  input: TypeBuildInput;
  title: string;
  ok: string;
  cancel: string;
  visible: boolean;
  handle: (result?: TypeUpdateEvent) => void;
}

export function getBuildTypeDefaults(): BuildTypeOptions
{
  return {
    input: null as unknown as TypeBuildInput,
    title: 'Choose Type',
    ok: 'Ok',
    cancel: 'Cancel',
    visible: false,
    handle: () => { /**/ },
  };
}

export const buildTypeDialog = getBuildTypeDefaults();

export async function getBuildType(options: Partial<BuildTypeOptions> = {}): Promise<TypeUpdateEvent | false>
{
  const { resolve, promise } = getPromiser<TypeUpdateEvent | false>();

  Object.assign(buildTypeDialog, getBuildTypeDefaults());
  Object.assign(buildTypeDialog, options);

  buildTypeDialog.visible = true;
  
  buildTypeDialog.handle = async (result?: TypeUpdateEvent) => 
  {
    buildTypeDialog.visible = false;

    return resolve(result || false);
  };

  return promise;
}

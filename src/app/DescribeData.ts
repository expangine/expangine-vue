
import { Type } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettings } from '@/runtime/types/TypeVisuals';


export interface DescribeDataOptions
{
  type: Type | null;
  settings: TypeSettings | null;
  data: any;
  input: string;
  removeDescribedRestrictions: boolean;
  visible: boolean;
  registry: Registry;
  close: (resolve: boolean) => any;
}

export function getDescribeDataDefaults(): DescribeDataOptions
{
  return {
    type: null,
    settings: null,
    data: null,
    input: '',
    removeDescribedRestrictions: true,
    visible: false,
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const describeDataDialog = getDescribeDataDefaults();

export type DescribeDataResult = { type: Type, settings: TypeSettings, data: any } | false;


export async function getDescribeData(options: Partial<DescribeDataOptions> = {}): Promise<DescribeDataResult>
{
  const { resolve, promise } = getPromiser<DescribeDataResult>();

  Object.assign(describeDataDialog, getDescribeDataDefaults());
  Object.assign(describeDataDialog, options);

  describeDataDialog.visible = true;
  describeDataDialog.close = (resolved) => {
    const { type, data, settings, removeDescribedRestrictions } = describeDataDialog;
    if (resolved && type && settings) {
      if (removeDescribedRestrictions){ 
        type.removeDescribedRestrictions();
      }
      resolve({ type, data, settings });
    } else {
      resolve(false);
    }
    describeDataDialog.visible = false;
  };

  return promise;
}

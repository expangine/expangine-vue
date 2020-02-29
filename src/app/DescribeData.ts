
import { Type } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_DESCRIBE_DATA = Preferences.define({
  key: 'fullscreen_describe_data',
  label: 'Describe Data dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});


export interface DescribeDataOptions
{
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: (result: DescribeDataResult) => any;
}

export function getDescribeDataDefaults(): DescribeDataOptions
{
  return {
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_DESCRIBE_DATA),
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
  describeDataDialog.close = (result) => {
    resolve(result);

    describeDataDialog.visible = false;
  };

  return promise;
}

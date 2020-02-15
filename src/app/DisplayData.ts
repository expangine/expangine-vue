
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { Preferences } from './Preference';


export const PREF_FULLSCREEN_DISPLAY_DATA = Preferences.define({
  key: 'fullscreen_display_data',
  label: 'Display Data dialog is fullscreen when opened',
  defaultValue: false,
});


export interface DisplayDataOptions
{
  title: string;
  data: any;
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: () => any;
}

export function getDisplayDataDefaults(): DisplayDataOptions
{
  return {
    title: 'Data',
    data: undefined,
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_DISPLAY_DATA),
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const displayDataDialog = getDisplayDataDefaults();

export async function getDisplayData(options: Partial<DisplayDataOptions> = {}): Promise<void>
{
  const { resolve, promise } = getPromiser<void>();

  Object.assign(displayDataDialog, getDisplayDataDefaults());
  Object.assign(displayDataDialog, options);

  displayDataDialog.visible = true;
  displayDataDialog.close = () => {
    resolve();
    displayDataDialog.visible = false;
  };

  return promise;
}

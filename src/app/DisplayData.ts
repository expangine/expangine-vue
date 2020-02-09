
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';


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
    fullscreen: false,
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

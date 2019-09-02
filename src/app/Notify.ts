
import { getPromiser } from './Promiser';

export interface NotifyOptions
{
  message: string;
  action: string;
  visible: boolean;
  handle: (actioned: boolean) => void;
}

export function getNotifyDefaults(): NotifyOptions
{
  return {
    message: 'Hello World',
    action: 'Close',
    visible: false,
    handle: () => { /**/ },
  };
}

export const notifyDialog = getNotifyDefaults();

export function sendNotification(options: Partial<NotifyOptions> = {}): Promise<boolean>
{
  const { resolve, promise } = getPromiser<boolean>();

  Object.assign(notifyDialog, getNotifyDefaults());
  Object.assign(notifyDialog, options);

  notifyDialog.visible = true;
  notifyDialog.handle = (actioned: boolean) => {
    notifyDialog.visible = false;
    resolve(actioned);
    notifyDialog.handle = () => { /**/ };
  };

  return promise;
}

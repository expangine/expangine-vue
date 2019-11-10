import { EventBase } from './EventBase';


export interface SystemEvent
{
  replaceData: (data: any) => void;
  loading: (loadable: () => Promise<any>) => void;
}

export class SystemEventClass extends EventBase<SystemEvent> { }

export const SystemEvents = new SystemEventClass();

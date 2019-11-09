import { EventBase } from './EventBase';


export interface SystemEvent
{
  replaceData: (data: any) => void;
}

export class SystemEventClass extends EventBase<SystemEvent> { }

export const SystemEvents = new SystemEventClass();

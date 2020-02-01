import { Type } from 'expangine-runtime';
import { EventBase } from './EventBase';
import { TypeSettings } from '@/runtime/types/TypeVisuals';


export interface SystemEvent
{
  replaceData: (data: any) => void;
  loading: (loadable: () => Promise<any>) => void;
  setType: (name: string, type: Type, settings: TypeSettings<any>, data: any[]) => void;
}

export class SystemEventClass extends EventBase<SystemEvent> { }

export const SystemEvents = new SystemEventClass();

import { objectEach, Relation, ReferenceData, Program, Entity, Func, NamedMap } from 'expangine-runtime';
import { EventBase } from './EventBase';
import { DirectiveOptions } from 'vue';
import { ExplorerTab } from './explorer/ExplorerTypes';


export interface SystemEvent
{
  loading: (loadable: () => Promise<any>) => void;
  openTab: (tab: ExplorerTab) => void;
  closeTab: (tab: ExplorerTab) => void;

  relationAdd: (relation: Relation) => void;
  relationChange: (relation: Relation) => void;
  relationRemove: (relation: Relation) => void;
  relationsCleared: (relation: NamedMap<Relation>) => void;
  relationsChanged: (relation: NamedMap<Relation>) => void;

  programAdd: (program: Program) => void;
  programChange: (program: Program) => void;
  programRemove: (program: Program) => void;
  programsCleared: (func: NamedMap<Program>) => void;
  programsChanged: (func: NamedMap<Program>) => void;

  dataAdd: (data: ReferenceData) => void;
  dataChange: (data: ReferenceData) => void;
  dataRemove: (data: ReferenceData) => void;
  datasCleared: (func: NamedMap<ReferenceData>) => void;
  datasChanged: (func: NamedMap<ReferenceData>) => void;

  typeAdd: (type: Entity) => void;
  typeChange: (type: Entity) => void;
  typeRemove: (type: Entity) => void;
  typesCleared: (func: NamedMap<Entity>) => void;
  typesChanged: (func: NamedMap<Entity>) => void;

  functionAdd: (func: Func) => void;
  functionChange: (func: Func) => void;
  functionRemove: (func: Func) => void;
  functionsCleared: (func: NamedMap<Func>) => void;
  functionsChanged: (func: NamedMap<Func>) => void;
}

export class SystemClass extends EventBase<SystemEvent> 
{ 

  public loadable(loader: () => Promise<any>): void
  {
    if (this.hasListeners('loading'))
    {
      this.trigger('loading', loader);
    }
    else
    {
      loader();
    }
  }

  public forkTab(root: ExplorerTab) 
  {
    const tab: ExplorerTab = {
      ...root,
      id: root.id + Math.random(),
      close: () => this.trigger('closeTab', tab),
    };

    this.trigger('openTab', tab);
  }
  
}

export const System = new SystemClass();


export const SystemEventsDirective: DirectiveOptions = {
  bind(el, binding) {
    objectEach(binding.value, (handler: any, eventName: any) => {
      System.on(eventName, handler);
    });
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      objectEach(binding.oldValue, (handler: any, eventName: any) => {
        System.off(eventName, handler);
      });
      objectEach(binding.value, (handler: any, eventName: any) => {
        System.on(eventName, handler);
      });
    }
  },
  unbind(el, binding) {
    objectEach(binding.value, (handler: any, eventName: any) => {
      System.off(eventName, handler);
    });
  },
};

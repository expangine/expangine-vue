import Vue from 'vue';
import { Project, ProjectTranscoderStores, ProjectType } from './Project';
import { copy } from 'expangine-runtime';
import { TranscoderStore, newStore } from './Transcoder';
import { friendlyList } from '@/common';
import { EventBase } from './EventBase';


export interface ProjectHistoryOptions
{
  project: Project;
  transcoders: ProjectTranscoderStores;
  canSave: () => boolean;
}

export const PROJECT_STATE_META = '$meta';

export interface ProjectStateMeta { at: number; details: string; }

export type ProjectState = Partial<Record<ProjectType, any> & { [PROJECT_STATE_META]: ProjectStateMeta }>;


export interface ProjectHistoryEvents
{
  change(history: ProjectHistory, type: keyof ProjectHistoryEvents): void;
  clear(history: ProjectHistory): void;
  undo(history: ProjectHistory, state: ProjectState): void;
  redo(history: ProjectHistory, state: ProjectState): void;
  push(history: ProjectHistory, state: ProjectState, details: string): void;
}

export class ProjectHistory extends EventBase<ProjectHistoryEvents>
{

  public undos: ProjectState[];
  public redos: ProjectState[];
  public last: ProjectState;
  public pushing: boolean;
  public project: Project;
  public transcoders: ProjectTranscoderStores;
  public undosTranscoder: TranscoderStore<ProjectState[], ProjectState[]>;
  public redosTranscoder: TranscoderStore<ProjectState[], ProjectState[]>;

  public constructor({ project, transcoders, canSave }: ProjectHistoryOptions)
  {
    super();

    this.project = project;
    this.transcoders = transcoders;
    this.last = {};
    this.pushing = false;
    this.undos = [];
    this.redos = [];
    this.undosTranscoder = newStore('undos', {
      encode: (value: ProjectState[]) => value,
      decode: (data: ProjectState[]) => data,
      getDefault: () => [],
      canSave,
    });
    this.redosTranscoder = newStore('redos', {
      encode: (value: ProjectState[]) => value,
      decode: (data: ProjectState[]) => data,
      getDefault: () => [],
      canSave,
    });

    this.loadHistory();
  }

  public getLastUndo(): ProjectState | null
  {
    return this.undos[this.undos.length - 1] || null;
  }

  public getLastRedos(): ProjectState | null
  {
    return this.redos[this.redos.length - 1] || null;
  }

  public getLastUndoDetails(): string
  {
    return this.getStateDetails(this.getLastUndo());
  }

  public getLastRedoDetails(): string
  {
    return this.getStateDetails(this.getLastRedos());
  }

  public getStateDetails(state: ProjectState | null | undefined): string
  {
    if (!state)
    {
      return '';
    }
    
    const meta = state[PROJECT_STATE_META];
    
    return meta ? meta.details || '' : '';
  }

  public clear()
  {
    this.redosTranscoder.save(this.redos = []);
    this.undosTranscoder.save(this.undos = []);

    this.trigger('clear', this);
    this.trigger('change', this, 'clear');
  }

  public goto(index: number): string | false
  {
    let last: string | false = false;

    if (index < 0)
    {
      let count = Math.min(-index, this.redos.length);

      while (--count >= 0) 
      {
        last = this.redo();
      }
    }
    else if (index > 0)
    {
      let count = Math.min(index, this.undos.length);

      while (--count >= 0) 
      {
        last = this.undo();
      }
    }

    return last;
  }

  public redo(): string | false
  {
    const redo = this.redos.pop();

    if (redo) 
    {
      this.undos.push(this.copyFromLast(redo));
      const applied = this.apply(redo);

      this.redosTranscoder.save(this.redos);
      this.undosTranscoder.save(this.undos);

      this.trigger('redo', this, redo);
      this.trigger('change', this, 'redo');

      return applied;
    }

    return false;
  }

  public undo(): string | false
  {
    const undo = this.undos.pop();

    if (undo) 
    {
      this.redos.push(this.copyFromLast(undo));
      const applied = this.apply(undo);

      this.redosTranscoder.save(this.redos);
      this.undosTranscoder.save(this.undos);

      this.trigger('undo', this, undo);
      this.trigger('change', this, 'undo');

      return applied;
    }

    return false;
  }

  public apply(state: ProjectState): string
  {
    const push: ProjectType[] = [];

    for (const prop in state) 
    {
      const key = prop as ProjectType;

      if (prop !== PROJECT_STATE_META && state[key] !== undefined) 
      {
        Vue.set(this.project, key, this.transcoders[key].decode(state[key]));

        push.push(key);
      }
    }

    this.pushLast(push);

    return 'Restored ' + friendlyList(push);
  }

  public resetLast()
  {
    this.pushLast(['type', 'settings', 'data', 'program', 'functions', 'metadata']);
  }

  public save(projectData: Partial<Project & ProjectStateMeta>, details: string = '')
  {
    const keys = this.getModified(projectData);

    this.push(keys, () => 
    {
      keys.forEach((key) => 
      {
        Vue.set(this.project, key, projectData[key]);
        this.transcoders[key].save(this.project[key]);
      });

    }, details);
  }

  public getModified<K extends ProjectType = ProjectType>(data: Partial<Record<K, any>>): K[]
  {
    const keys: K[] = [];

    for (const key in data) 
    {
      if (key !== PROJECT_STATE_META)
      {
        keys.push(key as unknown as K);
      }
    }

    return keys;
  }

  public pushLast(keys: ProjectType[])
  {
    keys.forEach((key) => 
    {
      this.last[key] = this.transcoders[key].encode(this.project[key]);
    });
  }

  public copyFromLast(state: ProjectState): ProjectState
  {
    const copied: ProjectState = {};
    const meta = state[PROJECT_STATE_META];

    if (meta) 
    {
      copied[PROJECT_STATE_META] = meta;
    }

    this.getModified(state).forEach((key) => 
    {
      copied[key] = copy(this.last[key]);
    });
    
    return copied;
  }

  public push(keys: ProjectType[], callback: () => any, details: string = '')
  {
    if (this.pushing) 
    {
      callback();

      return;
    }

    this.pushing = true;

    const state: ProjectState = { [PROJECT_STATE_META]: { at: Date.now(), details } };
    
    keys.forEach((prop) => 
    {
      state[prop] = copy(this.last[prop]);
    });

    if (this.redos.length) 
    {
      this.redos = [];
      this.redosTranscoder.save(this.redos);
    }

    this.undos.push(state);
    this.undosTranscoder.save(this.undos);
    
    try 
    {
      callback();
    } 
    catch (e) 
    {
      // ignore
    }

    this.pushLast(keys);
    this.pushing = false;

    this.trigger('push', this, state, details);
    this.trigger('change', this, 'push');

    window.console.log('saving to history', keys.toString());
  }

  private async loadHistory()
  {
    this.undos = await this.undosTranscoder.load();
    this.redos = await this.redosTranscoder.load();
  }

}

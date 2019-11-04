import { Project, ProjectTranscoderStores, ProjectType } from './Project';
import { copy } from 'expangine-runtime';
import { TranscoderStore, TranscoderErrorHandler, newStore } from './Transcoder';
import { friendlyList } from '@/common';


export interface ProjectHistoryOptions
{
  project: Project;
  transcoders: ProjectTranscoderStores;
  onSaveError: TranscoderErrorHandler<any, any>;
  canSave: () => boolean;
}

export type ProjectState = Partial<Record<ProjectType, any>>;

export class ProjectHistory
{

  public undos: ProjectState[];
  public redos: ProjectState[];
  public last: ProjectState;
  public pushing: boolean;
  public project: Project;
  public transcoders: ProjectTranscoderStores;
  public undosTranscoder: TranscoderStore<ProjectState[], ProjectState[]>;
  public redosTranscoder: TranscoderStore<ProjectState[], ProjectState[]>;

  public constructor({ project, transcoders, onSaveError, canSave }: ProjectHistoryOptions)
  {
    this.project = project;
    this.transcoders = transcoders;
    this.last = {};
    this.pushing = false;
    this.redosTranscoder = newStore('redos', {
      encode: (value: ProjectState[]) => value,
      decode: (data: ProjectState[]) => data,
      getDefault: () => [],
      onSaveError,
      canSave,
    }),
    this.undosTranscoder = newStore('undos', {
      encode: (value: ProjectState[]) => value,
      decode: (data: ProjectState[]) => data,
      getDefault: () => [],
      onSaveError,
      canSave,
    });

    this.undos = this.undosTranscoder.load();
    this.redos = this.redosTranscoder.load();
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

      if (state[key] !== undefined) 
      {
        this.project[key] = this.transcoders[key].decode(state[key]);

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

  public save(projectData: Partial<Project>)
  {
    const keys = this.getModified(projectData);

    this.push(keys, () => 
    {
      keys.forEach((key) => 
      {
        this.transcoders[key].save(this.project[key] = projectData[key]);
      });
    });
  }

  public getModified<K extends ProjectType = ProjectType>(data: Partial<Record<K, any>>): K[]
  {
    const keys: K[] = [];

    for (const key in data) 
    {
      keys.push(key as unknown as K);
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

    this.getModified(state).forEach((key) => 
    {
      copied[key] = copy(this.last[key]);
    });
    
    return copied;
  }

  public push(keys: ProjectType[], callback: () => any)
  {
    if (this.pushing) 
    {
      callback();

      return;
    }

    this.pushing = true;

    const state: ProjectState = {};
    
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

    window.console.log('saving to history', keys.toString());
  }

}

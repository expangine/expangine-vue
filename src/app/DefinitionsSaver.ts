
import Vue from 'vue';
import localforage from 'localforage';
import { diff_match_patch, patch_obj } from 'diff-match-patch';
import { Definitions, DefinitionsImportOptions } from 'expangine-runtime';
import { getSimpleInput } from './SimpleInput';
import { sendNotification } from './Notify';


const STORE_UNDOS = 'defs_undos';
const STORE_REDOS = 'defs_redos';
const STORE_STATE = 'defs_state';


const dmp = new diff_match_patch();
const storeUndos = localforage.createInstance({ name: STORE_UNDOS });
const storeRedos = localforage.createInstance({ name: STORE_REDOS });
const storeState = localforage.createInstance({ name: STORE_STATE });


export interface DefinitionsPatch
{
  time: number;
  patch: string;
}

export class DefinitionsSaver
{
  
  public defs: Definitions;
  public state: string;
  public undos: DefinitionsPatch[];
  public redos: DefinitionsPatch[];
  public component: any;
  public patching: boolean;
  public timeout: number;
  public debounce: number;

  public constructor(defs: Definitions, debounce: number = 1000)
  {
    this.defs = defs;
    this.state = this.getState();
    this.undos = [];
    this.redos = [];
    this.patching = false;
    this.timeout = -1;
    this.debounce = debounce;

    this.component = new Vue({
      data: { defs },
      watch: {
        defs: {
          deep: true,
          handler: () => this.changed(),
        },
      },
    });
  }

  public async load()
  {
    const state: string = await storeState.getItem('state');

    if (state)
    {
      this.defs.import(JSON.parse(state));
      this.state = state;
      this.undos.splice(0, this.undos.length, ...await this.loadPatches(storeUndos));
      this.redos.splice(0, this.redos.length, ...await this.loadPatches(storeRedos));
    }
  }

  public changed()
  {
    window.clearTimeout(this.timeout);

    this.timeout = window.setTimeout(() => this.save(), this.debounce);
  }

  public async save()
  {
    if (this.patching) 
    {
      this.patching = false;

      return;
    }

    const state = this.getState();
    const undo = this.getPatch(this.state, state);
    
    if (!undo)
    {
      return;
    }

    this.undos.push(undo);
    this.redos.splice(0, this.redos.length);
    this.state = state;

    this.tryStore(async () => 
    {
      await storeRedos.clear();
      await storeState.setItem('state', state);
      await storeUndos.setItem((this.undos.length - 1).toString(), undo);
    });
  }

  public async clear()
  {
    this.redos.splice(0, this.redos.length);
    this.undos.splice(0, this.undos.length);

    this.tryStore(async () =>
    {
      await storeUndos.clear();
      await storeRedos.clear();
    });
  }

  public async undoMany(n: number)
  {
    while (--n >= 0)
    {
      await this.undo(n !== 0);
    }
  }

  public async undo(delayApply: boolean = false)
  {
    const undo = this.undos.pop();

    if (undo) 
    {
      this.applyPatch(undo, delayApply);
      this.redos.push(undo);

      this.tryStore(async () => 
      {
        await storeUndos.removeItem(this.undos.length.toString());
        await storeState.setItem('state', this.state);
        await storeRedos.setItem((this.redos.length - 1).toString(), undo);
      });      
    }
  }

  public async redoMany(n: number)
  {
    while (--n >= 0)
    {
      await this.redo(n !== 0);
    }
  }

  public async redo(delayApply: boolean = false)
  {
    const redo = this.redos.pop();

    if (redo)
    {
      const redoReversed = this.reversePatch(redo);
      redo.time = redoReversed.time;

      this.applyPatch(redoReversed, delayApply);
      this.undos.push(redo);

      this.tryStore(async () =>
      {
        await storeRedos.removeItem(this.redos.length.toString());
        await storeState.setItem('state', this.state);
        await storeUndos.setItem((this.undos.length - 1).toString(), redo);
      });
    }
  }

  public getPatch(from: string, to: string): DefinitionsPatch | false
  {
    const patch = dmp.patch_make(to, from);

    if (patch.length === 0)
    {
      return false;
    }

    return {
      time: new Date().getTime(),
      patch: JSON.stringify(patch),
    };
  }

  public reversePatch(definitionsPatch: DefinitionsPatch): DefinitionsPatch
  {
    const patches: patch_obj[] = JSON.parse(definitionsPatch.patch);

    patches.forEach((patch) =>
    {
      patch.diffs.forEach((diff) =>
      {
        diff[0] = -diff[0];
      });
    });


    return { time: new Date().getTime(), patch: JSON.stringify(patches) };
  }

  public async applyPatch(definitionsPatch: DefinitionsPatch, delayApply: boolean = false)
  {
    const patch = JSON.parse(definitionsPatch.patch);
    const [ state ] = dmp.patch_apply(patch, this.state);
    
    this.patching = true;

    if (!delayApply)
    {
      const options: DefinitionsImportOptions = JSON.parse(state);
      this.defs.clearPrograms();
      this.defs.clearData();
      this.defs.clearFunctions();
      this.defs.clearEntities();
      this.defs.clearRelations();
      this.defs.import(options);
    }
    
    this.state = state;
  }

  public getState()
  {
    return JSON.stringify(this.defs.export());
  }

  public async loadPatches(store: LocalForage): Promise<DefinitionsPatch[]>
  {
    const patches: DefinitionsPatch[] = [];
    const count = await store.length();

    for (let i = 0; i < count; i++)
    {
      const patch: DefinitionsPatch = await store.getItem(i.toString());

      if (patch)
      {
        patches.push(patch);
      }
    }

    return patches;
  }

  public async tryStore(change: () => Promise<void>, retry: boolean = true)
  {
    try
    {
      await change();
    }
    catch (e)
    {
      const options = await getSimpleInput({
        title: 'Oh no!',
        message: 'There was an error saving your project data to your browser. This data is saved to your browser so you don\'t lose your work if the browser closes. If you have a lot of data or a long undo/redo history this error can be thrown. What would you like to do next to avoid this problem?',
        value: { 
          action: 'history' as 'clear' | 'ignore' | 'history',
          retry: false,
        },
        fields: [
          { name: 'action', type: 'select', label: 'Action', items: [
            { text: 'Clear all project data', value: 'clear' },
            { text: 'Clear undo/redo history only', value: 'history' },
            { text: 'Ignore error', value: 'ignore' },
          ]},
          ...(retry
              ? [{ name: 'retry', type: 'boolean', label: 'Retry' }]
              : [] as any
          ),
        ],
      });

      if (!options) 
      {
        return false;
      }
      
      switch (options.action) 
      {
        case 'history':
          await storeUndos.clear();
          await storeRedos.clear();
          
          sendNotification({ message: 'Undo/redo history cleared.' });
          break;

        case 'clear':
          await storeUndos.clear();
          await storeRedos.clear();
          await storeState.clear();
          
          sendNotification({ message: 'Project data cleared.' });
          break;

        case 'ignore':
          sendNotification({ message: 'Error ignored. Your last change could not be saved.' });
          break;
      }

      if (options.retry)
      {
        await this.tryStore(change, false);
      }
    }
  }

}

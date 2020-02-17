import { Type, copy, isString } from 'expangine-runtime';
import { Store } from './Store';
import Vue, { VueConstructor } from 'vue';


// tslint:disable: unified-signatures

export interface Preference<T = any>
{
  key: string;
  label: string;
  category: string[];
  defaultValue: T;
  type?: Type;
  component?: VueConstructor | string;
}

export type PreferenceInput<T = any> = string | Preference<T>;

export class PreferenceMap
{

  public prefs: Record<string, Preference> = Object.create(null);
  public values: Record<string, any> = Object.create(null);
  public prefix: string = 'pref-';

  public keyOf(key: PreferenceInput): string
  {
    return isString(key) ? key : key.key;
  }

  public get<T>(pref: Preference<T>): T;
  public get<T>(pref: string, otherwise: T): T;
  public get<T>(pref: PreferenceInput<T>, otherwise: T): T;
  public get<T>(pref: PreferenceInput<T>, otherwise?: T): T
  {
    return isString(pref)
      ? pref in this.values
        ? this.values[pref]
        : otherwise
      : pref.key in this.values
        ? this.values[pref.key]
        : pref.defaultValue;
  }

  public getPreference<T>(pref: PreferenceInput<T>): Preference<T>
  {
    return this.prefs[this.keyOf(pref)];
  }

  public has<T>(pref: PreferenceInput<T>): boolean
  {
    return this.keyOf(pref) in this.values;
  }

  public set<T>(pref: PreferenceInput<T>, value: T): this
  {
    const key = this.keyOf(pref);

    Vue.set(this.values, key, value);
    
    Store.set(this.prefix + key, JSON.stringify(value));

    return this;
  }

  public define<T>(pref: Preference<T>): Preference<T>
  {
    this.prefs[pref.key] = pref;

    if (!(pref.key in this.values))
    {
      Vue.set(this.values, pref.key, copy(pref.defaultValue));

      Store.get(this.prefix + pref.key).then((value) => 
      {
        if (value !== null && value !== undefined)
        {
          try
          {
            Vue.set(this.values, pref.key, JSON.parse(value));
          }
          catch (e)
          {
            window.console.log('JSON parsing error', e);
          }
        }
      });
    }

    return pref;
  }

}

export const Preferences = new PreferenceMap();

export const PreferenceCategory =
{
  EDITOR: 'Editor',
  CONFIRM: 'Confirmation',
  SHORTCUT: 'Shortcut',
  EXPRESSION: 'Expression',
  EXPRESSION_EDITOR: 'Expression Editor',
  REFACTOR: 'Refactor',
  DESIGN: 'Design',
  DATA: 'Data',
  FULLSCREEN: 'Fullscreen',
  SAVE: 'Save',
};

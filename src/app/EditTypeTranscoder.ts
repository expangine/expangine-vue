
import Vue from 'vue';
import { TypeStorage, Types, TypeStorageTranscoder, Exprs } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences } from './Preference';


export const PREF_FULLSCREEN_EDIT_TRANSCODER = Preferences.define({
  key: 'fullscreen_edit_transcoder',
  label: 'Edit transcoder dialog is fullscreen when opened',
  defaultValue: false,
});


export interface EditTypeTranscoderOptions
{
  property: string;
  transcoder: TypeStorageTranscoder;
  storage: TypeStorage;
  registry: Registry;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  fullscreen: boolean;
  handle: (confirm: boolean) => void;
}

export function getEditTypeTranscoderDefaults(): EditTypeTranscoderOptions {
  return {
    property: '',
    transcoder: { encode: Exprs.get('value'), decode: Exprs.get('value'), encodedType: Types.any() },
    storage: null as unknown as TypeStorage,
    registry: null as unknown as Registry,
    confirm: 'Save',
    unconfirm: 'Cancel',
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_EDIT_TRANSCODER),
    handle: () => { /* */ },
  };
}

export const editTypeTranscoderDialog = getEditTypeTranscoderDefaults();

export const editTypeTranscoderMultiplier = getMultipleDialoger(editTypeTranscoderDialog);

export async function getEditTypeTranscoder(options: Partial<EditTypeTranscoderOptions> = {}): Promise<TypeStorageTranscoder | false> 
{
  const { resolve, promise } = getPromiser<TypeStorageTranscoder | false>();

  editTypeTranscoderMultiplier.open(() => 
  {
    Object.assign(editTypeTranscoderDialog, getEditTypeTranscoderDefaults());
    Object.assign(editTypeTranscoderDialog, options);

    const { property, storage } = editTypeTranscoderDialog;
    const existing = property && property in storage.transcoders;

    if (existing)
    {
      editTypeTranscoderDialog.transcoder = storage.transcoders[property];
    }
    else
    {
      editTypeTranscoderDialog.transcoder.encodedType = storage.getDecodeExpected(property);
    }

    Vue.set(storage.transcoders, property, editTypeTranscoderDialog.transcoder);

    editTypeTranscoderDialog.handle = (confirm) => 
    {
      const { transcoder } = editTypeTranscoderDialog;
      
      if (confirm)
      {
        resolve(transcoder);
      }
      else
      {
        if (!existing)
        {
          Vue.delete(storage.transcoders, property);
        }

        resolve(false);
      }

      editTypeTranscoderMultiplier.close();
    };
  });

  return promise;
}

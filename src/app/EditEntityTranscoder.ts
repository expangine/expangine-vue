
import Vue from 'vue';
import { Types, Exprs, Entity, EntityTranscoder } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_EDIT_TRANSCODER = Preferences.define({
  key: 'fullscreen_edit_transcoder',
  label: 'Edit transcoder dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});


export interface EditEntityTranscoderOptions
{
  property: string;
  transcoder: EntityTranscoder;
  entity: Entity;
  registry: Registry;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  fullscreen: boolean;
  handle: (confirm: boolean) => void;
}

export function getEditEntityTranscoderDefaults(): EditEntityTranscoderOptions {
  return {
    property: '',
    transcoder: { encode: Exprs.get('value'), decode: Exprs.get('value'), encodedType: Types.any() },
    entity: null as unknown as Entity,
    registry: null as unknown as Registry,
    confirm: 'Close',
    unconfirm: 'Cancel',
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_EDIT_TRANSCODER),
    handle: () => { /* */ },
  };
}

export const editTypeTranscoderDialog = getEditEntityTranscoderDefaults();

export const editTypeTranscoderMultiplier = getMultipleDialoger(editTypeTranscoderDialog);

export async function getEditEntityTranscoder(options: Partial<EditEntityTranscoderOptions> = {}): Promise<EntityTranscoder | false> 
{
  const { resolve, promise } = getPromiser<EntityTranscoder | false>();

  editTypeTranscoderMultiplier.open(() => 
  {
    Object.assign(editTypeTranscoderDialog, getEditEntityTranscoderDefaults());
    Object.assign(editTypeTranscoderDialog, options);

    const { property, entity } = editTypeTranscoderDialog;
    const existing = property && property in entity.transcoders;

    if (existing)
    {
      editTypeTranscoderDialog.transcoder = entity.transcoders[property];
    }
    else
    {
      editTypeTranscoderDialog.transcoder.encodedType = entity.getDecodeExpected(property);
    }

    editTypeTranscoderDialog.handle = (saved) => 
    { 
      resolve(saved ? editTypeTranscoderDialog.transcoder : false);

      editTypeTranscoderMultiplier.close();
    };
  });

  return promise;
}

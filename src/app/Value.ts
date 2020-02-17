
import { Type, NullType, ObjectType } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { Registry } from '@/runtime/Registry';
import { getRandomNumber } from '@/common';
import { getBuildType } from './BuildType';
import { getMultipleDialoger } from './MultipleDialog';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_VALUE = Preferences.define({
  key: 'fullscreen_value',
  label: 'Value dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});


export interface ValueOptions
{
  title: string;
  message: string;
  registry: Registry;
  type: Type;
  settings: TypeSettings<any>;
  value: any;
  confirm: string;
  unconfirm: string;
  visible: boolean;
  fullscreen: boolean;
  handle: (confirmed: boolean) => void;
}

export function getValueDefaults(): ValueOptions {
  return {
    title: 'Input',
    message: 'Please enter a value',
    registry: null as unknown as Registry,
    type: NullType.baseType,
    settings: { input: '', defaultValue: null, options: null },
    value: null,
    confirm: 'Ok',
    unconfirm: 'Cancel',
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_VALUE),
    handle: () => { /* */ },
  };
}

export const valueDialog = getValueDefaults();

export const valueMultiplier = getMultipleDialoger(valueDialog);

export async function getValue(options: Partial<ValueOptions> = {}): Promise<any | null> 
{
  const { resolve, promise } = getPromiser<string | null>();

  valueMultiplier.open(() => 
  {
    Object.assign(valueDialog, getValueDefaults());
    Object.assign(valueDialog, options);

    const { registry, type, settings, value } = valueDialog;
    
    if (!registry.getTypeSettingsValidFor(type, settings)) 
    {
      valueDialog.settings = registry.getTypeSettings(type);
    }

    if (!type.isValid(value))
    {
      valueDialog.value = type.create();
    }

    valueDialog.handle = (confirmed: boolean) => 
    {
      confirmed ? resolve(valueDialog.value) : resolve(null);

      valueMultiplier.close();
    };
  });

  return promise;
}

export async function getAnyValue(registry: Registry, givenType?: Type | null)
{
  if (!givenType) 
  {
    const typeEvent = await getBuildType({
      title: 'Value Type',
      input: {
        registry,
      },
    });

    if (typeEvent) 
    {
      givenType = typeEvent.type;
    }
  }

  if (!givenType)
  {
    throw new Error('No type selected');
  }

  if (givenType.getId() === ObjectType.id)
  {
    return givenType.create();
  }

  let value = await getValue({
    title: 'Enter Value',
    message: '',
    registry,
    type: givenType,
  });

  if (value === null)
  {
    value = givenType.random(getRandomNumber);
  }

  return value;
}

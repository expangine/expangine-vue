import { Type, DataTypes } from 'expangine-runtime';
import { TypeModifier } from '../types/TypeModifier';
import { TypeSettings } from '../types/TypeVisuals';
import { Registry } from '../Registry';
import { TypeBuilder } from '../types/TypeBuilder';
import { sendNotification } from '@/app/Notify';



let copyType: Type | null = null;
let copySettings: TypeSettings | null = null;
let copyRegistry: Registry | null = null;


export const CopyModifier: TypeModifier = 
{
  getOption: ({ registry, type, typeSettings }) => ({
    text: 'Copy',
    description: 'Copy the type so you can paste it in another type',
    priority: 15,
    value: async () => {
      copyType = type.clone();
      copySettings = DataTypes.copy(typeSettings);
      copyRegistry = registry;

      sendNotification({ message: 'Type Copied!' });
      return false;
    },
  }),
};

export const PasteBuilder: TypeBuilder = 
{
  getOption: () => {
    if (!copyType || !copySettings || !copyRegistry) {
      return false;
    }

    const visuals = copyRegistry.getTypeVisuals(copyType);
    const name = visuals.name(copyType);
    const inputs = visuals.inputs[copySettings.input];
    const summary = inputs.getSummary(copySettings.options);

    return {
      text: `Paste ${name}`,
      description: summary,
      priority: 15,
      value: async () => (copyType && copySettings 
        ? { type: copyType.clone(), settings: DataTypes.copy(copySettings) } 
        : false
      ),
    };
  },
};

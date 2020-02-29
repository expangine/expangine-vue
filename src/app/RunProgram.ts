
import { Program } from 'expangine-runtime';
import { getPromiser } from './Promiser';
import { Registry } from '@/runtime/Registry';
import { Preferences, PreferenceCategory } from './Preference';


export const PREF_FULLSCREEN_RUN_PROGRAM = Preferences.define({
  key: 'fullscreen_run_program',
  label: 'Run program dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});


export interface RunProgramOptions
{
  program: Program;
  visible: boolean;
  fullscreen: boolean;
  registry: Registry;
  close: () => any;
}

export function getRunProgramDefaults(): RunProgramOptions
{
  return {
    program: null as any,
    visible: false,
    fullscreen: Preferences.get(PREF_FULLSCREEN_RUN_PROGRAM),
    registry: null as unknown as Registry,
    close: () => undefined,
  };
}

export const runProgramDialog = getRunProgramDefaults();

export async function getRunProgram(options: Partial<RunProgramOptions> = {}): Promise<void>
{
  const { resolve, promise } = getPromiser<void>();

  Object.assign(runProgramDialog, getRunProgramDefaults());
  Object.assign(runProgramDialog, options);

  runProgramDialog.visible = true;
  runProgramDialog.close = () => {
    resolve();
    runProgramDialog.visible = false;
  };

  return promise;
}

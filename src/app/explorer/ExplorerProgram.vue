<template>
  <ex-explorer-file 
    icon="mdi-code-braces" 
    :name="program.name"
    :name-filter="nameFilter"
    :auto-open="autoOpen"
    @update:auto-open="updateAutoOpen"
    @rename="renamed"
    @open="open"
    @close="close">
    <template #append>
      <v-menu offset-x>
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click.stop>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="duplicate">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Duplicate
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="saveAsFunction">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-function</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Save as Function
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setAsMain">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-numeric-1-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Set as Main
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="toJson">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-export</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Export
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="remove">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-delete</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Remove
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </ex-explorer-file>
</template>


<script lang="ts">
import Vue from 'vue';
import { Program, Entity, ReturnExpression, ObjectType, copy } from 'expangine-runtime';
import { ExplorerTab } from './ExplorerTypes';
import { Registry } from '@/runtime/Registry';
import { getInput } from '@/app/Input';
import { sendNotification } from '@/app/Notify';
import { getConfirmation } from '@/app/Confirm';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedExport } from '../ProjectExport';


const PREF_REMOVE_PROGRAM = Preferences.define({
  key: 'remove_program',
  label: 'Remove programs without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_SAVE_AS_FUNCTION_OVERWRITE = Preferences.define({
  key: 'save_as_function_overwrite',
  label: 'Save project as function and overwrite existing function without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    program: {
      type: Object as () => Program,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    nameFilter: {
      type: String,
      default: '',
    },
    autoOpen: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    tab: null as null | ExplorerTab,
  }),
  watch: {
    program(program: Program) {
      if (this.tab) {
        this.tab.bind.program = program;
      }
    },
  },
  methods: {
    async renamed(name: string) {
      const { program, registry: { defs } } = this;

      defs.renameProgram(program, name);
    },
    async duplicate() {
      const { program, registry: { defs } } = this;
      const name = await getInput({ title: 'Duplicate Name', value: program.name });

      if (name && !defs.getProgram(name)) {
        defs.addProgram({
          ...program.encode(),
          name,
        });
      } else if (name) {
        sendNotification({ message: 'A Program with that name already exists.' });
      } else {
        sendNotification({ message: 'Duplicate Program canceled.' });
      }
    },
    async remove() {
      const { program, registry: { defs } } = this;
      const message = `Are you sure you want to remove ${program.name}?`;

      if (await getConfirmation({ message, pref: PREF_REMOVE_PROGRAM })) {
        defs.removeProgram(program, true);
      }
    },
    async setAsMain() {
      const { program, registry: { defs } } = this;
      const i = defs.programs.indexOf(program);

      if (i === 0) {
        sendNotification({ message: 'This program is already the Main Program' });
      } else {
        defs.programs.moveToFront(program);
        sendNotification({ message: `${program.name} set as Main Program` });
      }
    },
    async saveAsFunction() {
      const { program, registry } = this;

      if (!(program.dataType instanceof ObjectType)) {
        return sendNotification({ message: 'Save as Function requires the input to be an object.' });
      }

      const name = await getInput({ label: 'Function Name' });

      if (!name) {
        return sendNotification({ message: 'Save as Function canceled' });
      }

      if (registry.defs.getFunction(name)) {
        if (!await getConfirmation({ message: 'A function with that name already exists, overwrite it?', pref: PREF_SAVE_AS_FUNCTION_OVERWRITE })) {
          return sendNotification({ message: 'Save as Function canceled' });
        }
      }

      const params = program.dataType.clone();
      const meta = copy(program.meta);
      const expression = program.expression instanceof ReturnExpression
        ? program.expression.clone()
        : new ReturnExpression(program.expression.clone());
      
      registry.defs.addFunction({
        name,
        params, 
        meta,
        expression,
      });
    },
    async toJson() {
      await getNamedExport('programs', this.program);
    },
    open(tab: ExplorerTab) {
      this.tab = tab;
      
      if (!tab.component) {
        const { program, registry } = this;

        tab.component = 'ex-edit-program';
        tab.bind = {
          hideName: true,
          program,
          registry,
        };
      }
      
      this.$emit('open', tab);
    },
    close(tab: ExplorerTab) {
      this.$emit('close', tab);
    },
    updateAutoOpen(autoOpen: string | null) {
      this.$emit('update:auto-open', autoOpen);
    },
  },
});
</script>
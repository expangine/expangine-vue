<template>
  <v-dialog persistent v-model="value" max-width="800" :fullscreen="isFullscreen">
    <v-card v-if="value">
      <v-card-title class="headline">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        Preferences
      </v-card-title>
      <v-card-text v-focus-on-visible="[value, 'input, textarea, select']">
        <v-list dense>
          <ex-child-filter>
            <template v-for="option in options">
              <v-list-item :key="option.key">
                <v-list-item-content>
                  <ex-type-input
                    :type="option.type"
                    :registry="registry"
                    :settings="option.settings"
                    v-model="option.value"
                  ></ex-type-input>
                </v-list-item-content>
              </v-list-item>
            </template>
          </ex-child-filter>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="cancel">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { copy, objectValues, Type } from 'expangine-runtime';
import { Preferences, Preference } from './Preference';
import { Registry } from '../runtime/Registry';
import { TypeSettings } from '../runtime/types/TypeVisuals';


const PREF_FULLSCREEN_PREFERENCE = Preferences.define({
  key: 'fullscreen_preference',
  label: 'Preference dialog is fullscreen when opened',
  defaultValue: false,
});


export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  data: () => ({
    fullscreen: Preferences.get(PREF_FULLSCREEN_PREFERENCE),
    options: [] as Array<{ 
      key: string, 
      pref: Preference, 
      type: Type, 
      settings: TypeSettings,
      value: any,
    }>,
  }),
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
  },
  watch: {
    value(visible: boolean) {
      if (visible) {
        this.options = objectValues(Preferences.prefs, (pref, key) => {
          const value = copy(Preferences.get(pref.key, pref.defaultValue));
          const type = pref.type || this.registry.defs.describe(value);
          const settings = this.registry.getTypeSettings(type, pref.label);

          return { key, pref, type, settings, value };
        });

        this.options.sort((a, b) => a.pref.label.localeCompare(b.pref.label));
      }
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_PREFERENCE, this.fullscreen);
    },
    save() {
      this.options.forEach(({ key, value }) =>
      {
        Preferences.set(key, value);
      });

      this.$emit('input', false);
    },
    cancel() {
      this.$emit('input', false);
    },
  },
});
</script>
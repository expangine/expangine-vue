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
        <v-list>
          <ex-child-filter @filter="updateFiltering">
            <template v-for="categoryOption in options">
              <v-list-group 
                :key="categoryOption.category"
                :value="filtering || categoryOption.visible" 
                @input="categoryOption.visible = $event">

                <template #activator>
                  <v-list-item-title>
                    <strong>{{ categoryOption.category }}</strong>
                  </v-list-item-title>
                </template>
                
                <template v-for="option in categoryOption.prefs">
                  <v-list-item :key="option.category">
                    <v-list-item-content v-if="option.component" class="pb-0 pt-3">
                      <component 
                        :is="option.component"
                        v-bind="option"
                        :label="option.pref.label"
                        v-model="option.value"
                      ></component>
                    </v-list-item-content>
                    <v-list-item-content v-else>
                      <ex-type-input
                        :type="option.type"
                        :registry="registry"
                        :settings="option.settings"
                        v-model="option.value"
                      ></ex-type-input>
                    </v-list-item-content>
                  </v-list-item>
                </template>

              </v-list-group>
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
import Vue, { VueConstructor } from 'vue';
import { DataTypes, objectEach, Type, objectValues } from 'expangine-runtime';
import { Preferences, Preference, PreferenceCategory } from './Preference';
import { Registry } from '../runtime/Registry';
import { TypeSettings } from '../runtime/types/TypeVisuals';


const PREF_FULLSCREEN_PREFERENCE = Preferences.define({
  key: 'fullscreen_preference',
  label: 'Preference dialog is fullscreen when opened',
  category: [PreferenceCategory.FULLSCREEN],
  defaultValue: false,
});

interface PreferenceInput
{ 
  key: string;
  pref: Preference;
  type: Type;
  settings: TypeSettings;
  value: any;
  component?: VueConstructor | string;
}

interface PreferenceCategoryInput
{ 
  category: string;
  visible: boolean;
  prefs: PreferenceInput[];
}

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
    options: [] as PreferenceCategoryInput[],
    filtering: false,
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
    value(visible: boolean) 
    {
      if (visible) 
      {
        const categoryMap: Record<string, PreferenceInput[]> = {};

        objectEach(Preferences.prefs, (pref, key) => 
        {
          const value = DataTypes.copy(Preferences.get(pref.key, pref.defaultValue));
          const type = pref.type || this.registry.defs.describe(value);
          const settings = this.registry.getTypeSettings(type, pref.label);
          const component = pref.component;
          const input: PreferenceInput = { key, pref, type, settings, value, component };

          pref.category.forEach((category) =>
          {
            (categoryMap[category] = categoryMap[category] || []).push(input);
          });
        });

        const options: PreferenceCategoryInput[] = objectValues(categoryMap, (prefs, category) => ({ prefs, category, visible: false }));
        options.forEach(({ prefs }) => prefs.sort((a, b) => a.pref.label.localeCompare(b.pref.label)));
        options.sort((a, b) => a.category.localeCompare(b.category));

        this.options = options;
      }
    },
  },
  methods: {
    updateFiltering(filter: string) {
      this.filtering = !!filter;
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_PREFERENCE, this.fullscreen);
    },
    save() {
      this.options.forEach(({ prefs }) => 
        prefs.forEach(({ key, value }) => 
          Preferences.set(key, value),
        ),
      );

      this.$emit('input', false);
    },
    cancel() {
      this.$emit('input', false);
    },
  },
});
</script>
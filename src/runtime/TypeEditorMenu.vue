<template>
  <v-menu 
    :close-on-content-click="false"
    v-model="editing"
  >
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-menu 
        offset-x
        min-width="400"
        :close-on-content-click="false"
        v-model="configuring" 
      >
        <template #activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-title>
              Configure Type
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="headline" v-html="visuals.name"></v-list-item-title>
              <v-list-item-subtitle v-html="visuals.description"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-select
                  filled
                  hide-details
                  label="Display As"
                  :disabled="readOnly"
                  :value="settings.input"
                  :items="inputs"
                  @input="setInput"
                ></v-select>
              </v-list-item-content>
            </v-list-item>
            <v-sheet 
              v-if="hasDefault && settings.options"
              class="mx-4 my-2 pa-3" 
              elevation="2"
              :dark="settings.options.dark"
            >
              <div class="pb-2">Default</div>
              <component
                :is="inputSelected.input"
                :type="type"
                :settings="settings"
                :registry="registry"
                :read-only="readOnly"
                v-model="defaultValue"
              ></component>
            </v-sheet>
            <v-sheet 
              v-if="hasConfigure"
              tile 
              max-height="300" 
              class="scrollable mt-3 py-3"
            >
              <component
                :is="visuals.options"
                v-bind="$props"
                v-on="$listeners"
              ></component>
            </v-sheet>
          </v-list>
          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                align="center"
                justify="end"
              >
                <v-btn @click="done">
                  Done
                </v-btn>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-menu>

      <v-menu 
        v-if="settings.input && !disableSubSettings"
        offset-x
        min-width="400"
        :close-on-content-click="false"
        v-model="inputing"
      >
        <template #activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-title>
              Edit {{ inputSelected.name }}
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="headline" v-html="inputSelected.name"></v-list-item-title>
              <v-list-item-subtitle v-html="inputSelected.description"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-sheet max-height="300" :dark="settings.options && settings.options.dark" class="scrollable mx-4 my-2 pa-3" elevation="2">
            <div class="pb-2">Preview</div>
            <component
              read-only
              :is="inputInput"
              :type="type"
              :settings="settings"
              :registry="registry"
              :value="defaultValue"
            ></component>
          </v-sheet>
          <v-sheet tile max-height="300" class="scrollable mt-3 py-3">
            <component 
              :is="inputSettings" 
              :type="type"
              :read-only="readOnly"
              v-model="settings.options"
              @input="updateSettings"
            ></component>
          </v-sheet>
          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                align="center"
                justify="end"
              >
                <v-btn @click="done">
                  Done
                </v-btn>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-menu>

      <template v-if="!readOnly && editing">
        <template v-for="modify in modifiableOptions">
          <v-list-item :key="modify.text" @click="onModify(modify)">
            <v-list-item-content>
              <v-list-item-title 
                v-html="modify.text"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-html="modify.description"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>

    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Type } from 'expangine-runtime';
import { ListOptions } from '../common';
import { TypeVisuals } from './TypeVisuals';
import { confirm } from '../app/Confirm';
import { TypeModifyOption, TypeModifyHandler } from './TypeModifier';
import TypeEditorBase from './types/TypeEditorBase';



export default TypeEditorBase<Type, any>().extend({
  data: () => ({
    editing: false,
    configuring: false,
    inputing: false,
  }),
  computed: {
    hasConfigure(): boolean {
      return !!this.visuals.options;
    },
    modifiableOptions(): ListOptions<TypeModifyHandler> {
      return this.registry.getTypeModifiersFor({
        registry: this.registry,
        parent: this.parent,
        type: this.type,
        typeSettings: this.settings,
      });
    },
    defaultValue: {
      get(): any {
        return this.type.fromJson(this.settings.defaultValue);
      },
      set(value: any) {
        this.settings.defaultValue = this.type.toJson(value);
        this.updateSettings();
      },
    },
  },
  methods: {
    setInput(inputId: string) {
      const prev = this.settings.options;
      const input = this.visuals.inputs[inputId];
      const next = input.getDefaultOptions();

      for (const prop in next) {
        if (prop in prev) {
          next[prop] = prev[prop];
        }
      }

      this.settings.input = inputId;
      this.settings.options = next;
      this.updateSettings();
    },
    async onModify(modifier: TypeModifyOption) {
      const result = await modifier.value();

      if (result) {
        this.$emit('change:type', result);
      }
      this.done();
    },
    done() {
      this.configuring = false;
      this.inputing = false;
      this.editing = false;
    },
  },
});
</script>

<style scoped>
.v-menu--inline {
  display: block;
}
.scrollable {
  overflow: scroll;
  border-top: 1px solid rgba(0, 0, 0, 0.14);
  border-bottom: 1px solid rgba(0, 0, 0, 0.14);
}
</style>
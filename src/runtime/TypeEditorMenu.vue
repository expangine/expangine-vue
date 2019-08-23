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
                  :value="settings.input"
                  :items="inputs"
                  @input="setInput"
                ></v-select>
              </v-list-item-content>
            </v-list-item>
            <v-sheet 
              v-if="hasDefault"
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
                v-model="settings.defaultValue"
                @input="updateSettings"
              ></component>
            </v-sheet>
            <v-sheet 
              v-if="hasConfigure"
              tile 
              max-height="300" 
              class="scrollable mt-3 py-3"
            >
              <slot name="configure"></slot>
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
        v-if="settings.input"
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
          <v-sheet max-height="300" :dark="settings.options.dark" class="scrollable mx-4 my-2 pa-3" elevation="2">
            <div class="pb-2">Preview</div>
            <component
              read-only
              :is="inputInput"
              :type="type"
              :settings="settings"
              :registry="registry"
              :value="settings.defaultValue"
            ></component>
          </v-sheet>
          <v-sheet tile max-height="300" class="scrollable mt-3 py-3">
            <component 
              :is="inputSettings" 
              :type="type"
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

      <v-list-item v-if="isRequired" @click="makeOptional">
        <v-list-item-title>
          Make Optional
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="isOptional" @click="makeRequired">
        <v-list-item-title>
          Make Required
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="isAlternative" @click="removeAlternative">
        <v-list-item-title>
          Remove Alternative Type
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="isOnly" @click="addAlternative">
        <v-list-item-title>
          Add Alternative Type
        </v-list-item-title>
      </v-list-item>

    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Type, OptionalType, ManyType } from 'expangine-runtime';
import TypeEditorBase from './types/TypeEditorBase';


export default TypeEditorBase<Type, any>().extend({
  data: () => ({
    editing: false,
    configuring: false,
    inputing: false,
  }),
  computed: {
    hasConfigure: {
      cache: false,
      get(): boolean {
        return !!this.$slots.configure;
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
    makeOptional() {
      this.$emit('change', new OptionalType(this.type));
      this.done();
    },
    makeRequired() {
      this.$emit('change', this.type);
      this.done();
    },
    removeAlternative() {
      if (this.parent instanceof ManyType) {
        const types = this.parent.options;
        const index = types.indexOf(this.type);
        if (index !== -1) {
          types.splice(index, 1);
        }
      }
      this.done();
    },
    addAlternative() {
      this.$emit('change', new ManyType([this.type]));
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
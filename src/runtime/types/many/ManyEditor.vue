<template>
  <v-list>
    <template v-for="(innerType, index) in type.options">
      <v-list-item :key="innerType.getId()">
        <v-list-item-avatar class="mr-0">
          <v-menu :close-on-content-click="false">
            <template #activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="removeType(index, innerType)">
                Remove Type
              </v-list-item>
              <v-list-item @click="addType(index, innerType)">
                Add Type
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-avatar>
        <v-list-item-content class="pa-0">
          <ex-type-editor
            :type="innerType"
            :parent="type"
            :settings="settings.sub[innerType.getId()]"
            :registry="registry"
            :read-only="readOnly"
            @input:type="updateType"
            @input:settings="updateSettings"
            @change:type="onChangeType(index, innerType, $event)"
          ></ex-type-editor>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { Type, ManyType } from 'expangine-runtime';
import { TypeAndSettings } from '../../TypeVisuals';
import { confirm } from '../../../app/Confirm';
import { ManySubs, ManyOptions } from './ManyTypes';
import TypeEditorBase from '../TypeEditorBase';
import { getBuildType } from '../../../app/BuildType';


export default TypeEditorBase<ManyType, ManyOptions, ManySubs>().extend({
  name: 'ManyEditor',
  methods: {
    async removeType(index: number, innerType: Type) {
      if (!await confirm()) {
        return;
      }

      this.type.options.splice(index, 1);
      this.$delete(this.settings.sub, innerType.getId());

      if (this.type.options.length === 1) 
      {
        const onlyType = this.type.options[0];
        const onlySettings = this.settings.sub[onlyType.getId()];

        this.changeType({ 
          type: onlyType,
          settings: onlySettings,
        });
      }
      else
      {
        this.updateTypeAndSettings();
      }
    },
    async addType(index: number, afterType: Type) {
      const newType = await getBuildType({
        registry: this.registry,
        title: 'Add Type',
        ok: 'Add',
        exclude: this.settings.sub,
      });

      if (!newType) {
        return;
      }

      const { type, settings } = await newType.onBuild();

      this.type.options.splice(index, 0, type);
      this.$set(this.settings.sub, type.getId(), settings);

      this.updateTypeAndSettings();
    },
    onChangeType(index: number, innerType: Type, { type: newType, settings: newSettings }: TypeAndSettings) {
      this.$set(this.type.options, index, newType);
      this.$set(this.settings.sub, innerType.getId(), newSettings);
      
      this.updateTypeAndSettings();
    },
  },
});
</script>

<style lang="sass" scoped>

</style>

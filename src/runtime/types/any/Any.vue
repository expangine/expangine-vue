<template>
  <v-list-item>
    <v-list-item-avatar class="mr-0">
      <v-btn icon @click="design">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon v-on="on">mdi-circle-edit-outline</v-icon>
          </template>
          <span>{{ designLabel }}</span>
        </v-tooltip>
      </v-btn>
      <v-dialog v-model="designing">
        <v-card>
          <v-card-title>
            Design Any Type
          </v-card-title>
          <v-card-text>
            <ex-type-editor
              :type="anyType"
              :read-only="readOnly"
              :registry="registry"
              :settings="anySettings"
              @input:type="setType"
              @change:type="changeType"
              @input:settings="setSettings"
              @transform="transform"
            ></ex-type-editor>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn text @click="designing = false">
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-list-item-avatar>
    <v-list-item-content class="pa-1" v-if="anyType">
      <ex-type-input
        :type="anyType"
        :read-only="readOnly"
        :registry="registry"
        :settings="anySettings"
        v-model="computedValue"
      ></ex-type-input>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Type, AnyType, Expression } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { AnyOptions } from './AnyTypes';
import { PropTypeAny } from '../../../common';
import { TypeSettings } from '../TypeVisuals';
import { TypeModifyResult } from '../TypeModifier';
import { getBuildType } from '../../../app/BuildType';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<AnyType, AnyOptions, any>(PropTypeAny).extend({
  name: 'Any',
  data: () => ({
    anyType: null as null | Type,
    anySettings: null as null | TypeSettings,
    designing: false,
  }),
  computed: {
    designLabel(): string {
      return this.settings.options.designLabel || 'Design';
    }, 
  },
  watch: {
    value: {
      immediate: true,
      handler(value: any) {
        const detectedType = this.registry.defs.describe(value);
        if (!this.anyType || !detectedType.acceptsType(this.anyType)) {
          this.anyType = detectedType;
          this.anyType.removeDescribedRestrictions();
          this.anySettings = this.registry.getTypeSettings(detectedType);
        }
      },
    },
  }, 
  methods: {
    async design() {
      if (!this.anyType) {
        const buildType = await getBuildType({ title: 'Choose Any Type' });
        if (buildType) {
          this.anyType = buildType.type;
          this.anySettings = buildType.settings;
          this.designing = true;
        }
      } else {
        this.designing = true;
      }
    },
    setType(type: Type) {
      this.anyType = type;
    },
    changeType(change: TypeModifyResult) {
      this.anyType = change.type;
      this.anySettings = change.settings;
    },
    setSettings(settings: TypeSettings) {
      this.anySettings = settings;
    },
    transform(expr?: Expression) {
      if (expr instanceof Expression) {
        const cmd = LiveRuntime.getCommand(expr);

        this.computedValue = cmd({ value: this.value });
      }
    },
  },
});
</script>

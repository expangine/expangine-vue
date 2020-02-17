<template>
  <div>
    <h3 class="pl-6">Text &amp; Value Types</h3>
    <v-list>
      <v-list-item>
        <v-list-item-avatar class="large-avatar">
          <v-chip label link outlined color="accent">Text</v-chip>
        </v-list-item-avatar>
        <v-list-item-content>
          <ex-type-editor
            v-bind="$props"
            disable-sub-settings
            :type="type.options.key"
            :required-type="requiredKey"
            :required-type-options="requiredTypeOptions"
            :settings="settings.sub.key"
            :parent="type"
            @change="onChangeKey"
          ></ex-type-editor>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar class="large-avatar">
          <v-chip label link outlined color="accent">Value</v-chip>
        </v-list-item-avatar>
        <v-list-item-content>
          <ex-type-editor
            v-bind="$props"
            disable-sub-settings
            :type="type.options.value"
            :required-type="requiredValue"
            :required-type-options="requiredTypeOptions"
            :settings="settings.sub.value"
            :parent="type"
            @change="onChangeValue"
          ></ex-type-editor>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <h3 class="pl-6">Constants</h3>
    <v-list>
      <template v-for="(constant, index) in constants">
        <v-list-item :key="index">
          <v-list-item-icon class="mr-2 pt-1">
            <v-btn icon @click="removeConstant(index)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-list-item-icon>
          <v-list-item-content class="pa-0">
            <v-container class="pa-0">
              <v-row>
                <v-col cols="6">
                  <ex-type-input
                    :value="constant[0]"
                    :type="type.options.key"
                    :read-only="readOnly"
                    :registry="registry"
                    :settings="settings.sub.key"
                    @input="setKey(index, $event)"
                  ></ex-type-input>
                </v-col>
                <v-col cols="6">
                  <ex-type-input
                    :value="constant[1]"
                    :type="type.options.value"
                    :read-only="readOnly"
                    :registry="registry"
                    :settings="settings.sub.value"
                    @input="setValue(index, $event)"
                  ></ex-type-input>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item>
        <v-list-item-icon>
          <v-btn icon color="primary" @click="addConstant">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { EnumType, EnumOptions, Expression, Exprs } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from '../../../app/Confirm';
import { TypeUpdateEvent, TypeSettings } from '../TypeVisuals';
import { EnumSubs } from './EnumTypes';
import TypeEditorBase from '../TypeEditorBase';
import { Preferences, PreferenceCategory } from '../../../app/Preference';


const PREF_REMOVE_CONSTANT = Preferences.define({
  key: 'enum_remove_constant',
  label: 'Remove Enum constant without confirmation',
  category: [PreferenceCategory.DESIGN, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default TypeEditorBase<EnumType, any, EnumSubs>().extend({
  name: 'EnumOptions',
  data: () => ({
    constants: [] as Array<[any, any]>,
  }),
  computed: {
    requiredKey() {
      return this.requiredType && this.requiredType instanceof EnumType
        ? this.requiredType.options.key
        : null;
    },
    requiredValue() {
      return this.requiredType && this.requiredType instanceof EnumType
        ? this.requiredType.options.value
        : null;
    },
  },
  watch: {
    'type.options.constants': {
      immediate: true,
      handler(value: Map<any, any>) {
        this.constants = Array.from(value.entries());
      },
    },
  },
  methods: {
    onChangeKey(event: TypeUpdateEvent) {
      this.type.options.key = event.type;
      this.$set(this.settings.sub, 'key', event.settings);

      if (event.transform) {
        const updateKeys = LiveRuntime.getCommand(
          this.type.getValueChangeExpression(event.transform, EnumType.STEP_KEY, EnumType.STEP_KEY),
        );
        
        this.type.options.constants = updateKeys({
          value: this.type.options.constants,
        });
      }
      
      this.update();
    },
    onChangeValue(event: TypeUpdateEvent) {
      this.type.options.value = event.type;
      this.$set(this.settings.sub, 'value', event.settings);

      let transform;
      if (event.transform) {
        const updateValues = LiveRuntime.getCommand(
          this.type.getValueChangeExpression(event.transform, EnumType.STEP_VALUE, EnumType.STEP_VALUE),
        );

        this.type.options.constants = updateValues({
          value: this.type.options.constants,
        });

        transform = event.transform;
      }

      this.change({ transform });
    },
    async removeConstant(index: number) {
      if (!await getConfirmation({ pref: PREF_REMOVE_CONSTANT })) {
        return;
      }
      
      this.constants.splice(index, 1);
      this.saveConstants();
    },
    addConstant() {
      const { key, value } = this.type.options;
      const { key: keySettings, value: valueSettings } = this.settings.sub as Record<EnumSubs, TypeSettings<any, any>>;

      this.constants.push([
        key.fromJson(keySettings.defaultValue),
        value.fromJson(valueSettings.defaultValue),
      ]);
      this.saveConstants();
    },
    setKey(index: number, value: any) {
      this.$set(this.constants[index], 0, value);
      this.saveConstants();
    },
    setValue(index: number, value: any) {
      this.$set(this.constants[index], 1, value);
      this.saveConstants();
    },
    saveConstants() {
      this.type.options.constants = new Map(this.constants);
      this.update();
    },
  },
});
</script>

<style lang="less" scoped>
.large-avatar {
  min-width: 64px !important;
  width: 64px !important;
  text-align: right;
  margin-right: 0px !important;
  justify-content: flex-end !important;
}
</style>
<template>
  <v-list class="pa-0">
    <v-list-item>
      <v-list-item-avatar class="ex-cell-top pt-1 mr-3">
        <ex-type-editor-menu
          v-bind="$props"
          :disable-sub-settings="false"
          @change="triggerChange"
        ></ex-type-editor-menu>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="primary--text">
          <strong>Tuple</strong>
        </v-list-item-title>
        <v-list-item-subtitle 
          v-if="!disableSubSettings"
          v-html="summary"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <template v-for="(innerType, index) in type.options">
      <v-list-item :key="index">
        <v-list-item-avatar class="ex-cell-top pt-1 mr-0">
          <v-menu :close-on-content-click="false" :disabled="readOnly">
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
              <!-- Sort -->
            </v-list>
            <ex-type-hook-list
              :registry="registry"
              :parent="type"
              :parent-settings="settings"
              :type="innerType"
              :type-settings="settings.sub[index]"
              :read-only="readOnly"
              :no-transform="noTransform"
            ></ex-type-hook-list>
          </v-menu>
        </v-list-item-avatar>
        <v-list-item-content class="pa-0">
          <ex-type-editor
            v-bind="$props"
            :type="innerType"
            :required-type="requiredTypeFor(index)"
            :required-type-options="requiredTypeOptions"
            :parent="type"
            :settings="settings.sub[index]"
            :disable-sub-settings="false"
            @change="onChange(index, innerType, $event)"
          ></ex-type-editor>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { Type, TupleType, Expression, ListOps, NullType, ObjectType, Exprs, Types } from 'expangine-runtime';
import { friendlyList } from '../../../common';
import { TypeUpdateEvent } from '../TypeVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { getProgram } from '../../../app/GetProgram';
import { getBuildType } from '../../../app/BuildType';
import { TupleSubs } from './TupleTypes';
import TypeEditorBase from '../TypeEditorBase';
import { sendNotification } from '../../../app/Notify';
import { Preferences, PreferenceCategory } from '../../../app/Preference';


const PREF_TUPLE_REMOVE_ELEMENT = Preferences.define({
  key: 'tuple_remove',
  label: 'Remove element from Tuple without confirmation',
  category: [PreferenceCategory.DESIGN, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default TypeEditorBase<TupleType, any, TupleSubs>().extend({
  name: 'TupleEditor',
  methods: {
    requiredTypeFor(index: number) {
      if (!(this.requiredType instanceof TupleType)) {
        return null;
      }

      return this.requiredType.options[index] || NullType.baseType;
    },
    async removeType(index: number, innerType: Type) {
      if (!await getConfirmation({ pref: PREF_TUPLE_REMOVE_ELEMENT })) {
        return;
      }

      this.type.options.splice(index, 1);
      this.settings.sub.splice(index, 1);

      this.inputSelected.onSubRemove(index, this.type, this.settings);

      const transform = this.type.getValueChangeExpression(Exprs.noop(), index, undefined);

      this.change({ transform });
    },
    async addType(index: number, afterType: Type) {
      const chosen = await getBuildType({
        input: {
          registry: this.registry,
        },
        title: `Add Type [${index + 2}]`,
        ok: 'Add',
      });

      if (!chosen) {
        return;
      }

      const updateEvent: Partial<TypeUpdateEvent> = {};

      if (!this.noTransform) {
        const result = await getProgram({
          title: `Add element "${index + 1}"`,
          message: 'The default value for the new element.',
          confirm: 'Add',
          registry: this.registry,
          context: Types.object({
            parent: this.type,
          }),
          program: this.registry.getTypeCreate(chosen.type),
          expectedType: chosen.type,
        });

        if (!result) {
          return sendNotification({ message: 'Element add canceled.' });
        }

        updateEvent.transform = this.type.getValueChangeExpression(result.program, undefined, index + 1);
      }

      this.type.options.splice(index + 1, 0, chosen.type);
      this.settings.sub.splice(index + 1, 0, chosen.settings);

      this.inputSelected.onSubAdd(index + 1, this.type, this.settings);

      this.change(updateEvent);
    },
    onChange(index: number, innerType: Type, event: TypeUpdateEvent) {
      this.$set(this.type.options, index, event.type);
      this.$set(this.settings.sub, index, event.settings);
      
      const transform = event.transform
        ? this.type.getValueChangeExpression(event.transform, index, index)
        : undefined;
      
      this.change({ transform });
    },
  },
});
</script>
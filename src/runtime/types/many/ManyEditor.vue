<template>
  <v-list class="pa-0">
    <template v-for="(innerType, index) in type.options">
      <v-list-item :key="index">
        <v-list-item-avatar class="ex-cell-top pt-1 mr-0">
          <v-menu :close-on-content-click="false" :disabled="readOnly">
            <template #activator="{ on }">
              <v-btn icon v-on="on" :color="color">
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
            <ex-type-hook-list
              :registry="registry"
              :parent="type"
              :parent-settings="settings"
              :type="innerType"
              :type-settings="settings.sub[index]"
              :read-only="readOnly"
            ></ex-type-hook-list>
          </v-menu>
        </v-list-item-avatar>
        <v-list-item-content class="pa-0">
          <ex-type-editor
            v-bind="$props"
            :type="innerType"
            :required-type="requiredTypeFor(innerType, index)"
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
import { Type, ManyType, NullType, Expression, ExpressionBuilder } from 'expangine-runtime';
import { TypeUpdateEvent } from '../TypeVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { getBuildType } from '../../../app/BuildType';
import { ManySubs, ManyOptions } from './ManyTypes';
import TypeEditorBase from '../TypeEditorBase';
import { castExpression } from '../../../common';


export default TypeEditorBase<ManyType, ManyOptions, ManySubs>().extend({
  name: 'ManyEditor',
  methods: {
    requiredTypeFor(type: Type, index: number): Type | null {
      if (!(this.requiredType instanceof ManyType)) {
        return null;
      }

      const subs = this.requiredType.options;
      const valid = subs.find((sub) => this.isValidType(sub, type));

      return valid || NullType.baseType;
    },
    async removeType(index: number, innerType: Type) {
      if (!await getConfirmation()) {
        return;
      }

      this.type.options.splice(index, 1);
      this.settings.sub.splice(index, 1);

      const { type, settings } = this;

      const ex = new ExpressionBuilder();
      const destType = this.type.options[0];
      const castTransform = castExpression(innerType, destType);
      const transform = ex
        .if(destType.getValidateExpression(ex))
        .than(ex.get('value'))
        .else(castTransform)
      ;

      const simplify = this.type.options.length === 1;

      this.triggerChange({
        type: simplify ? type.options[0] : type,
        settings: simplify ? settings.sub[0] : settings,
        transform,
      });
    },
    async addType(index: number, afterType: Type) {
      const chosen = await getBuildType({
        input: {
          registry: this.registry,
        },
        title: 'Add Type',
        ok: 'Add',
      });

      if (!chosen) {
        return;
      }

      this.type.options.splice(index + 1, 0, chosen.type);
      this.settings.sub.splice(index + 1, 0, chosen.settings);

      this.update();
    },
    onChange(index: number, innerType: Type, event: TypeUpdateEvent) {
      this.$set(this.type.options, index, event.type);
      this.$set(this.settings.sub, index, event.settings);

      let transform;
      if (event.transform) {
        const ex = new ExpressionBuilder();
        const isValid = this.type.getValidateExpression(ex);

        transform = ex
          .if(ex.not(isValid))
          .than(event.transform)
          .else(ex.get('value'))
        ;
      }

      this.change({ transform });
    },
  },
});
</script>
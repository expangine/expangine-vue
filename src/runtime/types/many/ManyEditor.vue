<template>
  <v-list class="pa-0">
    <template v-for="(innerType, index) in type.options">
      <v-list-item :key="index">
        <v-list-item-avatar class="cell-top pt-1 mr-0">
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
            :type="innerType"
            :parent="type"
            :settings="settings.sub[index]"
            :registry="registry"
            :read-only="readOnly"
            @input:type="updateType"
            @input:settings="updateSettings"
            @change:type="onChangeType(index, innerType, $event)"
            @transform="transformType(index, innerType, $event)"
          ></ex-type-editor>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { Type, ManyType, Expression, ExpressionBuilder } from 'expangine-runtime';
import { TypeAndSettings } from '../TypeVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { getBuildType } from '../../../app/BuildType';
import { ManySubs, ManyOptions } from './ManyTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<ManyType, ManyOptions, ManySubs>().extend({
  name: 'ManyEditor',
  methods: {
    async removeType(index: number, innerType: Type) {
      if (!await getConfirmation()) {
        return;
      }

      this.type.options.splice(index, 1);
      this.settings.sub.splice(index, 1);

      const destType = this.type.options[0];

      if (this.type.options.length === 1) 
      {
        const onlyType = this.type.options[0];
        const onlySettings = this.settings.sub[0];

        this.changeType({ 
          type: onlyType,
          settings: onlySettings,
        });
      }
      else
      {
        this.updateTypeAndSettings();
      }

      const ex = new ExpressionBuilder();
      const destVisual = this.registry.getTypeVisuals(destType);
      const cast = `${innerType.getId()}:~${destType.getId()}`;
      const castOperation = innerType.getOperations()[cast];
      const transform = castOperation
        ? ex.op(castOperation, { value: ex.get('value') })
        : destVisual.exprs.create(this.registry, destType);

      this.transform(
        ex
          .if(destVisual.exprs.valid(this.registry, destType))
          .then(ex.get('value'))
          .else(transform),
      );
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

      this.updateTypeAndSettings();
    },
    onChangeType(index: number, innerType: Type, { type: newType, settings: newSettings }: TypeAndSettings) {
      this.$set(this.type.options, index, newType);
      this.$set(this.settings.sub, index, newSettings);
      
      this.updateTypeAndSettings();
    },
    transformType(index: number, innerType: Type, transform: Expression) {
      const ex = new ExpressionBuilder();
      const isValid = this.visuals.exprs.valid(this.registry, this.type);

      this.transform(ex
        .if(ex.not(isValid))
        .then(transform)
        .else(ex.get('value')),
      );
    },
  },
});
</script>

<style lang="sass" scoped>

</style>

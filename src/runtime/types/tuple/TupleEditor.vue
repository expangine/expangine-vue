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
import { Type, TupleType, Expression, ExpressionBuilder, ListOps, NullType } from 'expangine-runtime';
import { friendlyList } from '../../../common';
import { TypeUpdateEvent } from '../TypeVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { getBuildType } from '../../../app/BuildType';
import { TupleSubs } from './TupleTypes';
import TypeEditorBase from '../TypeEditorBase';


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
      if (!await getConfirmation()) {
        return;
      }

      this.type.options.splice(index, 1);
      this.settings.sub.splice(index, 1);

      this.inputSelected.onSubRemove(index, this.type, this.settings);

      const ex = new ExpressionBuilder();

      this.change({
        transform: ex.body(
          ex.op(ListOps.removeAt, {
            list: ex.get('value'),
            index,
          }),
          ex.get('value'),
        ),
      });
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

      this.type.options.splice(index + 1, 0, chosen.type);
      this.settings.sub.splice(index + 1, 0, chosen.settings);

      this.inputSelected.onSubAdd(index + 1, this.type, this.settings);

      const ex = new ExpressionBuilder();

      this.change({
        transform: ex.op(ListOps.insert, {
          list: ex.get('value'),
          index: index + 1,
          item: this.registry.getTypeCreate(chosen.type),
        }),
      });
    },
    onChange(index: number, innerType: Type, event: TypeUpdateEvent) {
      this.$set(this.type.options, index, event.type);
      this.$set(this.settings.sub, index, event.settings);
      
      let transform;
      if (event.transform) {
        const ex = new ExpressionBuilder();

        transform = ex.body(
          ex.update('value', index)
            .to(event.transform, 'value'),
          ex.get('value'),
        );
      }

      this.change({ transform });
    },
  },
});
</script>
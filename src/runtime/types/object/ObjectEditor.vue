<template>
  <div>
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
          <strong>Object</strong>
        </v-list-item-title>
        <v-list-item-subtitle 
          v-if="!disableSubSettings"
          v-html="summary"
        ></v-list-item-subtitle>
        <v-list-item-subtitle 
          class="grey--text"
          v-html="description"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-simple-table dense>
      <colgroup>
        <col>
        <col style="width: 100%;">
      </colgroup>
      <thead>
        <tr class="ex-accent-bar">
          <th class="text-right pr-6" style="min-width: 100px">Property</th>
          <th class="text-left pl-6">Type</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(propType, prop) in type.options.props">
          <tr :key="prop">
            <td class="text-right border-right ex-cell-top pa-3 pt-4">
              <v-menu :disabled="readOnly">
                <template #activator="{ on }">
                  <v-chip label link outlined v-on="on" color="accent" class="property-element">{{ prop }}</v-chip>
                </template>
                <v-list>
                  <v-list-item @click="remove(prop)">
                    Remove
                  </v-list-item>
                  <v-list-item @click="rename(prop)">
                    Rename
                  </v-list-item>
                </v-list>
                <ex-type-hook-list
                  :registry="registry"
                  :parent="type"
                  :parent-settings="settings"
                  :type="propType"
                  :type-settings="settings.sub[prop]"
                  :read-only="readOnly"
                  :no-transform="noTransform"
                ></ex-type-hook-list>
              </v-menu>
            </td>
            <td class="px-0">
              <ex-type-editor
                v-bind="$props"
                :type="propType"
                :required-type="requiredTypeFor(prop)"
                :required-type-options="requiredTypeOptions"
                :parent="type"
                :settings="settings.sub[prop]"
                :disable-sub-settings="false"
                @change="onChange(prop, $event)"
              ></ex-type-editor>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot v-if="!readOnly">
        <tr>
          <td class="pa-1 border-right text-right">
            <v-text-field
              solo
              hide-details
              placeholder="Name"
              v-model="addProp"
              v-focus-on-change="[propChange, 'input']"
            ></v-text-field>
          </td>
          <td class="ex-cell-top pa-3">
            <v-btn icon @click="add" :disabled="!isValidProp">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </td>
        </tr>
      </tfoot>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { ObjectType, Exprs, Types } from 'expangine-runtime';
import { friendlyList } from '@/common';
import { getConfirmation } from '@/app/Confirm';
import { getInput } from '@/app/Input';
import { sendNotification } from '@/app/Notify';
import { getBuildType } from '@/app/BuildType';
import { getProgram } from '@/app/GetProgram';
import { Preferences, PreferenceCategory } from '@/app/Preference';
import { TypeUpdateEvent } from '../TypeVisuals';
import TypeEditorBase from '../TypeEditorBase';


const PREF_REMOVE_PROP = Preferences.define({
  key: 'object_remove_prop',
  label: 'Remove Object type property without confirmation',
  category: [PreferenceCategory.DESIGN, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default TypeEditorBase<ObjectType, any, string>().extend({
  name: 'ObjectEditor',
  data: () => ({
    addProp: '',
    propChange: 1,
  }),
  computed: {
    isValidProp(): boolean {
      return !!(this.addProp && !(this.addProp in this.type.options.props) && this.registry.isValidProperty(this.addProp, this.type));
    },
    description(): string {
      return friendlyList(Object.keys(this.type.options.props));
    },
  },
  methods: {
    requiredTypeFor(prop: string) {
      if (!(this.requiredType instanceof ObjectType)) {
        return null;
      }

      return this.requiredType.options.props[prop] 
        || this.requiredType.getWildcardType();
    },
    async add() {
      const chosen = await getBuildType({
        title: 'Add Property',
        input: {
          registry: this.registry,
          parent: this.type,
          parentSettings: this.settings,
        },
      });

      const propName = this.addProp;

      if (!propName || !chosen) {
        return;
      }

      this.addProp = '';

      const changeEvent: Partial<TypeUpdateEvent> = {};

      if (!this.noTransform) {
        const result = await getProgram({
          title: `Add property "${propName}"`,
          message: 'The default value for the new property.',
          confirm: 'Add',
          registry: this.registry,
          context: Types.object({
            parent: this.type,
          }),
          program: chosen.transform
            ? chosen.transform
            : this.registry.getTypeCreate(chosen.type),
          expectedType: chosen.type,
        });

        if (!result) {
          return sendNotification({ message: 'Property add canceled.' });
        }

        changeEvent.transform = this.type.getValueChangeExpression(result.program, undefined, propName);
      }
      
      this.$set(this.type.options.props, propName, chosen.type);
      this.$set(this.settings.sub, propName, chosen.settings);

      this.inputSelected.onSubAdd(propName, this.type, this.settings);

      this.change(changeEvent);
      this.propChange++;

      this.$emit('prop:add', propName);
    },
    async remove(prop: string) {
      if (!await getConfirmation({ message: `Remove ${prop}?`, pref: PREF_REMOVE_PROP })) {
        return;
      }

      this.inputSelected.onSubRemove(prop, this.type, this.settings);

      this.$delete(this.type.options.props, prop);
      this.$delete(this.settings.sub, prop);

      const transform = this.type.getValueChangeExpression(Exprs.noop(), prop, undefined);

      this.change({ transform });
      this.propChange++;

      this.$emit('prop:remove', prop);
    },
    async rename(prop: string) {
      const newProp = await getInput({ 
        title: 'Rename',
        message: 'Enter a new name for this property',
        label: 'Name',
        value: prop,
      });

      if (!newProp) {
        return;
      }
      if (newProp === prop) {
        return sendNotification({ message: 'The property name will remain the same.' });
      }
      if (newProp in this.type.options.props) {
        return sendNotification({ message: 'A property with that name already exists.' });
      }

      this.inputSelected.onSubMove(prop, newProp, this.type, this.settings);

      const propType = this.type.options.props[prop];
      const propSettings = this.settings.sub[prop];

      this.$delete(this.type.options.props, prop);
      this.$delete(this.settings.sub, prop);

      this.$set(this.type.options.props, newProp, propType);
      this.$set(this.settings.sub, newProp, propSettings);

      sendNotification({ message: `${prop} renamed to ${newProp}` });

      const transform = this.type.getValueChangeExpression(Exprs.noop(), prop, newProp);

      this.change({ transform });

      this.$emit('prop:rename', [prop, newProp]);
    },
    onChange(prop: string, event: TypeUpdateEvent) {
      this.type.options.props[prop] = event.type;
      this.settings.sub[prop] = event.settings;

      const transform = event.transform
        ? this.type.getValueChangeExpression(event.transform, prop, prop)
        : undefined;

      this.change({ transform });

      this.$emit('prop:change', prop);
    },
  },
});
</script>

<style scoped>
.property-element {
  white-space: nowrap;
}
.v-input.v-text-field--single-line >>> input {
  text-align: right;
}
.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

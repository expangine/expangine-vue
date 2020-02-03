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
        <tr class="grey lighten-3">
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
import { ObjectType, ObjectOps, Expression, Exprs } from 'expangine-runtime';
import { friendlyList } from '../../../common';
import { getConfirmation } from '../../../app/Confirm';
import { getInput } from '../../../app/Input';
import { sendNotification } from '../../../app/Notify';
import { getBuildType } from '../../../app/BuildType';
import { getProgram } from '../../../app/GetProgram';
import { TypeUpdateEvent } from '../TypeVisuals';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<ObjectType, any, string>().extend({
  name: 'ObjectEditor',
  data: () => ({
    addProp: '',
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
          context: ObjectType.from({
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

        changeEvent.transform = Exprs.define({ parent: Exprs.get('value') },
          Exprs.op(ObjectOps.set, {
            object: Exprs.get('value'),
            key: propName,
            value: result.program,
          }),
        );
      }
      
      this.$set(this.type.options.props, propName, chosen.type);
      this.$set(this.settings.sub, propName, chosen.settings);

      this.inputSelected.onSubAdd(propName, this.type, this.settings);

      this.change(changeEvent);
    },
    async remove(prop: string) {
      if (!await getConfirmation({ message: `Remove ${prop}?`})) {
        return;
      }

      this.inputSelected.onSubRemove(prop, this.type, this.settings);

      this.$delete(this.type.options.props, prop);
      this.$delete(this.settings.sub, prop);

      this.change({
        transform: Exprs.body(
          Exprs.op(ObjectOps.delete, {
            object: Exprs.get('value'),
            key: prop,
          }),
          Exprs.get('value'),
        ),
      });
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

      this.change({
        transform: Exprs.body(
          Exprs.op(ObjectOps.set, {
            object: Exprs.get('value'),
            key: newProp,
            value: Exprs.get('value', prop),
          }),
          Exprs.op(ObjectOps.delete, {
            object: Exprs.get('value'),
            key: prop,
          }),
          Exprs.get('value'),
        ),
      });
    },
    onChange(prop: string, event: TypeUpdateEvent) {
      this.type.options.props[prop] = event.type;
      this.settings.sub[prop] = event.settings;

      let transform;
      if (event.transform) {
        transform = Exprs.body(
          Exprs.update('value', prop)
            .to(event.transform, 'value'),
          Exprs.get('value'),
        );
      }

      this.change({ transform });
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

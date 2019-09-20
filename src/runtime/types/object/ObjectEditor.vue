<template>
  <div>
    <v-list-item>
      <v-list-item-avatar class="cell-top pt-1 mr-3">
        <ex-type-editor-menu
          :type="type"
          :settings="settings"
          :registry="registry"
          :parent="parent"
          :read-only="readOnly"
          @input:type="updateType"
          @input:settings="updateSettings"
          @change:type="changeType"
          @transform="transform"
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
            <td class="text-right border-right cell-top pa-4">
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
                ></ex-type-hook-list>
              </v-menu>
            </td>
            <td class="pl-0">
              <ex-type-editor
                :type="propType"
                :parent="type"
                :registry="registry"
                :settings="settings.sub[prop]"
                :read-only="readOnly"
                @input:type="updateType"
                @input:settings="updateSettings"
                @change:type="onChangeType(prop, $event)"
                @transform="transformProp(prop, $event)"
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
          <td class="cell-top pa-3">
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
import { ObjectType, ExpressionBuilder, ObjectOps, Expression } from 'expangine-runtime';
import { friendlyList } from '../../../common';
import { getConfirmation } from '../../../app/Confirm';
import { getInput } from '../../../app/Input';
import { sendNotification } from '../../../app/Notify';
import { getBuildType } from '../../../app/BuildType';
import { TypeAndSettings } from '../../TypeVisuals';
import TypeEditorBase from '../TypeEditorBase';
import { TypeBuildResult } from '../../TypeBuilder';
import { TypeModifyResult } from '../../TypeModifier';


export default TypeEditorBase<ObjectType, any, string>().extend({
  name: 'ObjectEditor',
  data: () => ({
    addProp: '',
  }),
  computed: {
    isValidProp(): boolean {
      return !!(this.addProp && !(this.addProp in this.type.options.props));
    },
    description(): string {
      return friendlyList(Object.keys(this.type.options.props));
    },
  },
  methods: {
    async add() {
      const chosen = await getBuildType({
        input: {
          registry: this.registry,
          parent: this.type,
          parentSettings: this.settings,
        },
        title: 'Add Property',
      });

      const propName = this.addProp;

      if (!propName || !chosen) {
        return;
      }

      this.$set(this.type.options.props, propName, chosen.type);
      this.$set(this.settings.sub, propName, chosen.settings);

      this.addProp = '';

      this.inputSelected.onSubAdd(propName, this.type, this.settings);

      this.updateTypeAndSettings();

      const ex = new ExpressionBuilder();

      this.transform(
        ex.op(ObjectOps.set, {
          object: ex.get('value'),
          key: propName,
          value: this.registry.getCreate(chosen.type),
        }),
      );
    },
    async remove(prop: string) {
      if (!await getConfirmation({ message: `Remove ${prop}?`})) {
        return;
      }

      this.inputSelected.onSubRemove(prop, this.type, this.settings);

      this.$delete(this.type.options.props, prop);
      this.$delete(this.settings.sub, prop);

      this.updateTypeAndSettings();

      const ex = new ExpressionBuilder();

      this.transform(
        ex.body(
          ex.op(ObjectOps.delete, {
            object: ex.get('value'),
            key: prop,
          }),
          ex.get('value'),
        ),
      );
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

      this.updateTypeAndSettings();

      sendNotification({ message: `${prop} renamed to ${newProp}` });

      const ex = new ExpressionBuilder();

      this.transform(
        ex.body(
          ex.op(ObjectOps.set, {
            object: ex.get('value'),
            key: newProp,
            value: ex.get('value', prop),
          }),
          ex.op(ObjectOps.delete, {
            object: ex.get('value'),
            key: prop,
          }),
          ex.get('value'),
        ),
      );
    },
    transformProp(prop: string, transform: Expression) {
      const ex = new ExpressionBuilder();

      this.transform(
        ex.body(
          ex.update('value', prop)
            .to(transform, 'value'),
          ex.get('value'),
        ),
      );
    },
    onChangeType(prop: string, result: TypeModifyResult) {
      this.type.options.props[prop] = result.type;
      this.settings.sub[prop] = result.settings;

      this.updateTypeAndSettings();
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

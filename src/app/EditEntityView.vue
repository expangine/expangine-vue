<template>
  <div v-system-events="{ relationsChanged }">
    <ex-namer
      v-if="!hideName"
      auto-validate
      :validate="validateName"
      :value="entity.name"
      @input="renamed"
      @remove="remove"
    ></ex-namer>

    <v-tabs vertical icons-and-text background-color="grey lighten-3" v-model="tab">
      <v-tab>
        <v-icon>mdi-file-tree</v-icon>
        Design  
      </v-tab>
      <v-tab :disabled="disableStorage">
        <v-icon>mdi-database</v-icon>
        Storage
      </v-tab>
      <v-tab :disabled="disableData">
        <v-icon>mdi-database-edit</v-icon>
        Data
      </v-tab>
      <v-tab :disabled="disableData">
        <v-icon>mdi-axis-arrow</v-icon>
        Relations
      </v-tab>
      <v-tab>
        <v-icon>mdi-function</v-icon>
        Methods
      </v-tab>
      <v-tab>
        <v-icon>mdi-information-outline</v-icon>
        Info
      </v-tab>
      <v-tab>
        <v-icon>mdi-swap-horizontal-bold</v-icon>
        Refs
      </v-tab>
      <v-tabs-items touchless v-model="tab">
        <v-tab-item>
          <ex-type-editor
            :type="type"
            :registry="registry"
            :settings="settings"
            :no-transform="zeroReferences"
            @change="handleChange"
            @prop:remove="onPropertyRemove"
            @prop:rename="onPropertyRename"
          ></ex-type-editor>
        </v-tab-item>
        <v-tab-item>
          <div>

            <v-tabs class="ex-accent-bar">
              <v-tab>Identifier</v-tab>
              <v-tab :disabled="disableData">Indexes</v-tab>
              <v-tab :disabled="disableData">Transcoders</v-tab>
              <v-tab-item class="pa-3">
                <v-select
                  outlined
                  persistent-hint
                  label="Identifier"
                  hint="How instances of this type are uniquely identified."
                  :items="primaryTypes"
                  v-model="entity.primaryType"
                ></v-select>

                <div v-if="definesKey">
                  <ex-expression-editor
                    :context="keyContext"
                    :registry="registry"
                    :settings="settings"
                    :required-type="keyReturnType"
                    :value="entity.key"
                    @input="onUpdateKey"
                  ></ex-expression-editor>
                </div>

                <div v-if="definesDescribe" class="mt-3">
                  <h5>
                    A short description of a given instance.
                    <span v-if="disableData" class="error--text">
                      You must specify this expression to enable indexing, transcoders, data, and relationships for this entity.
                    </span>
                  </h5>
                  <ex-expression-editor
                    :context="describeContext"
                    :registry="registry"
                    :settings="settings"
                    :required-type="describeReturnType"
                    v-model="entity.describe"
                  ></ex-expression-editor>
                </div>
              </v-tab-item>
              <v-tab-item>
                <v-simple-table class="ex-table-fixed">
                  <colgroup>
                    <col style="width: 30%">
                    <col style="width: 70%">
                    <col style="width: 100px">
                    <col style="width: 110px">
                  </colgroup>
                  <thead class="v-data-table--dense">
                    <tr class="ex-accent-bar">
                      <th>Name</th>
                      <th>Properties</th>
                      <th>Type</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="index in indices">
                      <tr :key="index.name">
                        <td>{{ index.name }}</td>
                        <td>
                          <template v-for="prop in index.props">
                            <v-chip :key="prop">{{ prop }}</v-chip>
                          </template>
                        </td>
                        <td>{{ index.primary ? 'Primary' : index.unique ? 'Unique' : '' }}</td>
                        <td v-if="canEditIndex(index.name)">
                          <v-btn icon @click="editIndex(index)">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon @click="removeIndex(index)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                        <td v-else></td>
                      </tr>
                    </template>
                  </tbody>
                </v-simple-table>
                <v-btn class="ma-3" @click="addIndex">
                  <v-icon>mdi-plus</v-icon>
                  Add Index
                </v-btn>
              </v-tab-item>
              <v-tab-item>
                <v-simple-table class="ex-table-fixed">
                  <colgroup>
                    <col style="width: 15%">
                    <col style="width: 15%">
                    <col style="width: 30%">
                    <col style="width: 30%">
                    <col style="width: 110px">
                  </colgroup>
                  <thead class="v-data-table--dense">
                    <tr class="ex-accent-bar">
                      <th>Property</th>
                      <th>To</th>
                      <th>Encode</th>
                      <th>Decode</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="item in transcoders">
                      <tr :key="item.prop">
                        <td>{{ item.prop }}</td>
                        <template v-if="item.transcoder">
                          <td>{{ getTypeDescription(item.transcoder.encodedType) }}</td>
                          <td class="ex-single-line">{{ getExpressionDescription(item.transcoder.encode) }}</td>
                          <td class="ex-single-line">{{ getExpressionDescription(item.transcoder.decode) }}</td>
                          <td>
                            <v-btn icon @click="editTranscoder(item.prop)">
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon @click="removeTranscoder(item.prop)">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </template>
                        <template v-else>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>
                            <v-btn icon @click="editTranscoder(item.prop)">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </td>
                        </template>
                      </tr>
                    </template>
                  </tbody>
                </v-simple-table>
              </v-tab-item>
            </v-tabs>
            
          </div>
        </v-tab-item>
        <v-tab-item class="data-container">
          <ex-type-input
            :type="dataType"
            :registry="registry"
            :settings="dataSettings"
            v-model="entity.instances"
          ></ex-type-input>
        </v-tab-item>
        <v-tab-item class="data-container">
          <v-simple-table class="ex-table-fixed">
            <colgroup>
              <col style="width: 15%">
              <col style="width: 15%">
              <col style="width: 30%">
              <col style="width: 30%">
              <col style="width: 110px">
            </colgroup>
            <thead class="v-data-table--dense">
              <tr class="ex-accent-bar">
                <th>Name</th>
                <th>Kind</th>
                <th>Related</th>
                <th>Related Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="relation in relations">
                <tr :key="relation.relationName">
                  <td>{{ relation.name }}</td>
                  <td>{{ getRelationType(relation) }}</td>
                  <td>
                    <template v-for="related in relation.related">
                      <v-chip :key="related.name">{{ related.name }}</v-chip>
                    </template>
                  </td>
                  <td>{{ getTypeDescription(relation.relationType) }}</td>
                  <td>
                    <v-btn icon @click="editRelation(relation)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="removeRelation(relation)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
          <v-btn class="ma-3" @click="addRelation">
            <v-icon>mdi-plus</v-icon>
            Add Relation
          </v-btn>
        </v-tab-item>
        <v-tab-item>
          <v-simple-table class="ex-table-fixed">
            <colgroup>
              <col style="width: 30%">
              <col style="width: 70%">
              <col style="width: 110px">
            </colgroup>
            <thead class="v-data-table--dense">
              <tr class="ex-accent-bar">
                <th>Name</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="method in entity.methods">
                <tr :key="method.name">
                  <td>{{ method.name }}</td>
                  <td>{{ method.description }}</td>
                  <td>
                    <v-btn icon @click="editMethod(method)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="removeMethod(method)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
          <v-btn class="ma-3" @click="addMethod">
            <v-icon>mdi-plus</v-icon>
            Add Method
          </v-btn>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  outlined
                  hide-details
                  auto-grow
                  rows="5"
                  label="Description"
                  v-model="entity.description"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-chip label>
                  Created:&nbsp;<timeago :datetime="entity.created"></timeago>
                </v-chip>
                <v-chip label class="ml-4">
                  Updated:&nbsp;<timeago :datetime="entity.updated"></timeago>
                </v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <p v-if="references.length === 0" class="pa-3">
            <v-alert type="info">
              This Type is not referenced by anything.
            </v-alert>
          </p>
          <v-list dense v-else>
            <template v-for="(ref, index) in references">
              <ex-definitions-reference 
                :key="index"
                :reference="ref" 
                :registry="registry"
              ></ex-definitions-reference>
            </template>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Func, ObjectType, Types, EntityPrimaryType, EntityIndex, objectEach, Expression, objectToArray, EntityRelation, Entity, DefinitionsEntityReference } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { Registry } from '../runtime/Registry';
import { TypeSettings, TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { getConfirmation } from './Confirm';
import { renameEntity, addEntity, removeEntity } from './EntityBuilders';
import { getEditEntityIndex } from './EditEntityIndex';
import { getEditEntityTranscoder } from './EditEntityTranscoder';
import { Preferences, PreferenceCategory } from './Preference';
import { getEditRelation, getRelationKindText } from './EditRelation';
import { sendNotification } from './Notify';
import { getEditMethod } from './EditMethod';



const PREF_REMOVE_INDEX = Preferences.define({
  key: 'aliased_remove_index',
  label: 'Remove user-defined type indexes without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_REMOVE_TRANSCODER = Preferences.define({
  key: 'aliased_remove_transcoder',
  label: 'Remove user-defined type transcoders without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_REMOVE_RELATION = Preferences.define({
  key: 'aliased_remove_relation',
  label: 'Remove user-defined type relations without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_REMOVE_METHOD = Preferences.define({
  key: 'aliased_remove_method',
  label: 'Remove user-defined type methods without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_REMOVE_TYPE = Preferences.define({
  key: 'aliased_remove_type',
  label: 'Remove user-defined type without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default Vue.extend({
  props: {
    entity: {
      type: Object as () => Entity,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    hideName: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    relations: [] as EntityRelation[],
    tab: 0,
  }),
  computed: {
    type(): Type {
      return this.entity.type;
    },
    settings(): TypeSettings {
      if (this.registry.getTypeSettingsValidFor(this.type, this.entity.meta)) {
        return this.entity.meta;
      }
      
      return this.entity.meta = this.registry.getTypeSettings(this.type);
    },
    definesKey(): boolean {
      return !!this.entity && this.entity.primaryType === EntityPrimaryType.GIVEN;
    },
    keyContext(): Type {
      return this.entity.getKeyContext();
    },
    keyReturnType(): Type {
      return Types.many(Types.text(), Types.number());
    },
    keyOutputType(): Type | null {
      return this.entity.key.getType(this.registry.defs, this.keyContext);
    },
    definesDescribe(): boolean {
      return true;
    },
    describeContext(): Type {
      return this.entity.getDescribeContext();
    },
    describeReturnType(): Type {
      return Types.text();
    },
    describeOutputType(): Type | null {
      return this.entity.describe.getType(this.registry.defs, this.describeContext);
    },
    indices(): EntityIndex[] {
      const indices: EntityIndex[] = [];
      if (!this.entity) {
        return indices;
      }
      const definedPrimary = this.entity.getPrimary('primary', false);
      if (!definedPrimary) {
        const dynamicPrimary = this.entity.getPrimary();
        if (dynamicPrimary) {
          indices.push(dynamicPrimary);
        }
      }
      objectEach(this.entity.indexes, (index) => indices.push(index));
      return indices;
    },
    transcoders() {
      return objectToArray(this.entity.type.options.props, (_, prop) => ({
        prop,
        transcoder: this.entity ? this.entity.transcoders[prop] || null : null,
      }));
    },
    primaryTypes() {
      return [
        { value: EntityPrimaryType.AUTO_INCREMENT, text: 'Auto Incrementing Number' },
        { value: EntityPrimaryType.UUID, text: 'Universally Unique Identifier' },
        { value: EntityPrimaryType.GIVEN, text: 'User Defined Identifier' },
      ];
    },
    disableStorage(): boolean {
      return !this.entity.name || !!this.validateName(this.entity.name);
    },
    disableData(): boolean {
      return !this.entity.canStore(this.registry.defs);
    },
    zeroReferences(): boolean {
      if (this.entity.instances.length > 0) {
        return false;
      }
      if (this.registry.defs.getEntityReferences(this.entity.name).length > 0) {
        return false;
      }
      return true;
    },
    dataType(): Type {
      return Types.list(this.entity.type);
    },
    dataSettings(): TypeSettings<any> {
      const dataSettings = this.registry.getTypeSettings(this.dataType) as TypeSettings<any, 'item'>;
      dataSettings.sub.item = this.entity.meta;
      return dataSettings;
    },
    references(): DefinitionsEntityReference[] {
      return this.registry.defs.getEntityReferences(this.entity);
    },
  },
  watch: {
    entity: {
      immediate: true,
      handler() {
        this.relations = this.registry.defs.getRelations(this.entity.name);
      },
    },
  },
  methods: {
    renamed(newName: string) {
      const { registry, entity } = this;
      const { defs } = registry;

      if (entity.name) {
        const updates = defs.renameEntity(entity.name, newName);

        if (updates && updates.length) {
          sendNotification({ message: `${updates.length} Type reference(s) updated.` });
        }

        renameEntity(registry, entity.name, newName);
      } else {
        entity.name = newName;

        defs.addEntity(entity);

        addEntity(registry, newName);
      }
    },
    validateName(name: string) {
      if (!name) {
        return 'A name is required.';
      }

      const existing = this.registry.defs.getEntity(name);
      if (existing && existing !== this.entity) {
        return 'An entity already exists with that name.';
      }

      return '';
    },
    async remove() {
      const refs = this.registry.defs.getEntityReferences(this.entity.name).length;

      /**
       * TODO: If has references, do you want to cancel OR replace references with defined type OR remove references?
       */

      if (!await getConfirmation({ message: `Are you sure you want to remove this type? It is referenced ${refs} times.`, pref: PREF_REMOVE_TYPE })) {
        return;
      }

      if (!this.registry.defs.removeEntity(this.entity)) {
        sendNotification({ message: 'You cannot remove a referenced Type.' });
      } else {
        removeEntity(this.registry, this.entity.name);

        this.$emit('remove', this.entity);
      }
    },
    relationsChanged() {
      this.relations = this.registry.defs.getRelations(this.entity.name);
    },
    canEditIndex(name: string) {
      if (!this.entity) {
        return false;
      }
      const index = this.entity.indexes[name];
      if (!index) {
        return false;
      }
      if (index.primary && this.entity.primaryType !== EntityPrimaryType.GIVEN) {
        return false;
      }
      return true;
    },
    async editIndex(index: EntityIndex) {
      const { entity, registry } = this;

      await getEditEntityIndex({
        index,
        entity,
        registry,
      });
    },
    async addIndex() {
      const { entity, registry } = this;

      await getEditEntityIndex({
        entity,
        registry,
      });
    },
    async removeIndex(index: EntityIndex) {
      const { entity } = this;

      if (await getConfirmation({ pref: PREF_REMOVE_INDEX })) {      
        entity.removeIndex(index.name);
      }
    },
    async editTranscoder(property: string) {
      const { entity, registry } = this;

      await getEditEntityTranscoder({
        property,
        entity,
        registry,
      });
    },
    async removeTranscoder(property: string) {
      const { entity } = this;

      if (await getConfirmation({ pref: PREF_REMOVE_TRANSCODER })) {
        entity.removeTranscoder(property);
      }
    },
    getRelationType(typeRelation: EntityRelation) {
      return getRelationKindText(typeRelation.kind);
    },
    async addRelation() {
      const { registry } = this;

      const result = await getEditRelation({
        registry,
      });

      if (result) {
        this.relationsChanged();
      }
    },
    async editRelation(typeRelation: EntityRelation) {
      const { registry } = this;
      
      const result = await getEditRelation({
        registry,  
        relation: typeRelation.relation,
      });

      if (result) {
        this.relationsChanged();
      }
    },
    async removeRelation(typeRelation: EntityRelation) {
      const relations = this.registry.defs.relations;

      if (relations.has(typeRelation.relation.name) && await getConfirmation({ pref: PREF_REMOVE_RELATION })) {
        this.relations.splice(this.relations.indexOf(typeRelation), 1);

        relations.remove(typeRelation.relation.name);
      }
    },
    async addMethod() {
      const { entity, registry } = this;
      
      await getEditMethod({
        entity,
        registry,
      });
    },
    async editMethod(method: Func) {
      const { entity, registry } = this;

      const edited = await getEditMethod({
        entity,
        method,
        registry,
      });

      if (edited) {
        registry.defs.trigger('updateMethod', registry.defs, method, entity);
      }
    },
    async removeMethod(method: Func) {
      if (await getConfirmation({ pref: PREF_REMOVE_METHOD })) {
        this.registry.defs.removeMethod(this.entity, method);
      }
    },
    getTypeDescription(type: Type) {
      return this.registry.getTypeDescribe(type);
    },
    getExpressionDescription(ex: Expression) {
      return this.registry.getExpressionDescribe(ex);
    },
    handleChange(event: TypeUpdateEvent) {
      const { type, settings, transform } = event;

      if (transform) {
        this.registry.defs.refactorEntity(this.entity.name, transform, LiveRuntime);
      }

      this.entity.type = type as ObjectType;
      this.entity.meta = settings;
    },
    onUpdateKey(key: Expression) {
      this.entity.key = key;
      this.entity.updateKeyType(this.registry.defs);
    },
    onPropertyRemove(prop: string) {
      this.registry.defs.removeEntityProp(this.entity.name, prop);
    },
    onPropertyRename([oldProp, newProp]: [string, string]) {
      this.registry.defs.renameEntityProp(this.entity.name, oldProp, newProp);
    },
  },
});
</script>
<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          label="Name"
          :error="invalidSaveAs"
          v-focus-on-visible="[visible, 'input']"
          v-model="saveAs"
        ></v-text-field>

        <v-tabs vertical icons-and-text background-color="grey lighten-3">
          <v-tab>
            <v-icon>mdi-file-tree</v-icon>
            &nbsp;&nbsp;Design  
          </v-tab>
          <v-tab :disabled="disableStorage">
            <v-icon>mdi-database</v-icon>
            &nbsp;&nbsp;Storage
          </v-tab>
          <v-tab :disabled="disableData">
            <v-icon>mdi-database-edit</v-icon>
            &nbsp;&nbsp;Data
          </v-tab>
          <v-tab :disabled="disableRelations">
            <v-icon>mdi-axis-arrow</v-icon>
            &nbsp;&nbsp;Relations
          </v-tab>
          <v-tab-item>
            <ex-type-editor
              :type="type"
              :registry="registry"
              :settings="settings"
              :no-transform="withoutData"
              @change="handleChange"
            ></ex-type-editor>
          </v-tab-item>
          <v-tab-item>
            <div v-if="canAddStorage" class="pa-3">
              <p>
                Adding storage allows type instances to be stored globally, efficiently, and enables you to define relationships between types.
              </p>
              <v-btn @click="addStorage">
                Enable Storage
              </v-btn>
            </div>
            <div v-else>

              <v-tabs>
                <v-tab>Identifier</v-tab>
                <v-tab>Indexes</v-tab>
                <v-tab>Transcoders</v-tab>
                <v-tab-item class="pa-3">
                  <v-select
                    outlined
                    persistent-hint
                    label="Identifier"
                    hint="How instances of this type are uniquely identified."
                    :items="primaryTypes"
                    v-model="storage.primaryType"
                  ></v-select>

                  <div v-if="definesKey">
                    <ex-expression-editor
                      :context="keyContext"
                      :registry="registry"
                      :settings="settings"
                      :required-type="keyReturnType"
                      v-model="storage.key"
                    ></ex-expression-editor>
                  </div>

                  <div v-if="definesDescribe" class="mt-3">
                    <h5>A short description of a given instance</h5>
                    <ex-expression-editor
                      :context="describeContext"
                      :registry="registry"
                      :settings="settings"
                      :required-type="describeReturnType"
                      v-model="storage.describe"
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
                      <tr class="grey lighten-3">
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
                      <tr class="grey lighten-3">
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
              v-model="data"
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
                <tr class="grey lighten-3">
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
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          v-html="confirm" 
          @click="triggerSave(false)"
        ></v-btn>
         <v-btn 
          color="primary"
          v-html="confirmClose" 
          @click="triggerSave(true)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="unconfirm" 
          @click="done(false)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ObjectType, Types, TypeStorage, TypeStoragePrimaryType, TypeIndex, objectEach, TypeStorageTranscoder, Expression, objectToArray, TypeRelation, ListType } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { TypeSettings, TypeUpdateEvent } from '@/runtime/types/TypeVisuals';
import { getEditTypeIndex } from './EditTypeIndex';
import { getEditTypeTranscoder } from './EditTypeTranscoder';
import { getEditRelation, getRelationKindText } from './EditRelation';
import { getConfirmation } from './Confirm';
import { editAliasedDialog } from './EditAliased';


export default Vue.extend({
  data: () => editAliasedDialog,
  computed: {
    definesKey(): boolean {
      return !!this.storage && this.storage.primaryType === TypeStoragePrimaryType.GIVEN;
    },
    keyContext(): Type {
      return this.storage
        ? this.storage.getKeyContext()
        : Types.null();
    },
    keyReturnType(): Type {
      return Types.many(Types.text(), Types.number());
    },
    definesDescribe(): boolean {
      return !!this.storage;
    },
    describeContext(): Type {
      return this.storage
        ? this.storage.getDescribeContext()
        : Types.null();
    },
    describeReturnType(): Type {
      return Types.text();
    },
    indices(): TypeIndex[] {
      const indices: TypeIndex[] = [];
      if (!this.storage) {
        return indices;
      }
      const definedPrimary = this.storage.getPrimary('primary', false);
      if (!definedPrimary) {
        const dynamicPrimary = this.storage.getPrimary();
        if (dynamicPrimary) {
          indices.push(dynamicPrimary);
        }
      }
      objectEach(this.storage.indexes, (index) => indices.push(index));
      return indices;
    },
    transcoders() {
      return objectToArray(this.type.options.props, (_, prop) => ({
        prop,
        transcoder: this.storage ? this.storage.transcoders[prop] || null : null,
      }));
    },
    primaryTypes() {
      return [
        { value: TypeStoragePrimaryType.AUTO_INCREMENT, text: 'Auto Incrementing Number' },
        { value: TypeStoragePrimaryType.UUID, text: 'Universally Unique Identifier' },
        { value: TypeStoragePrimaryType.GIVEN, text: 'User Defined Identifier' },
      ];
    },
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    title(): string {
      return this.name ? 'Edit Type' : 'Add Type';
    },
    invalidSaveAs(): boolean {
      if (!this.saveAs) {
        return true;
      }
      const existing = this.registry.defs.aliased[this.saveAs];
      if (existing && existing !== this.type) {
        return true;
      }
      return false;
    },
    disableStorage(): boolean {
      return this.invalidSaveAs || !this.name;
    },
    disableData(): boolean {
      return !this.storage
        || !this.storage.getPrimary();
    },
    withoutData(): boolean {
      return !this.data || this.data.length === 0;
    },
    disableRelations(): boolean {
      return !this.storage
        || !this.storage.getPrimary();
    },
    dataType(): Type {
      return Types.list(this.type);
    },
    dataSettings(): TypeSettings<any> {
      const dataSettings = this.registry.getTypeSettings(this.dataType) as TypeSettings<any, 'item'>;
      dataSettings.sub.item = this.settings;
      return dataSettings;
    },
    canAddStorage(): boolean {
      return !this.storage;
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    addStorage() {
      this.storage = new TypeStorage({ name: this.name }, this.registry.defs);
    },
    canEditIndex(name: string) {
      if (!this.storage) {
        return false;
      }
      const index = this.storage.indexes[name];
      if (!index) {
        return false;
      }
      if (index.primary && this.storage.primaryType !== TypeStoragePrimaryType.GIVEN) {
        return false;
      }
      return true;
    },
    async editIndex(index: TypeIndex) {
      const { type, storage, registry } = this;

      await getEditTypeIndex({
        index,
        type,
        storage,
        registry,
      });
    },
    async addIndex() {
      const { type, storage, registry } = this;

      await getEditTypeIndex({
        type,
        storage,
        registry,
      });
    },
    async removeIndex(index: TypeIndex) {
      const { storage } = this;

      if (storage && await getConfirmation()) {      
        Vue.delete(storage.indexes, index.name);
      }
    },
    async editTranscoder(property: string) {
      const { storage, registry } = this;

      if (!storage) {
        return;
      }

      await getEditTypeTranscoder({
        property,
        storage,
        registry,
      });
    },
    async removeTranscoder(property: string) {
      const { storage } = this;

      if (storage && await getConfirmation()) {
        Vue.delete(storage.transcoders, property);
      }
    },
    getRelationType(typeRelation: TypeRelation) {
      return getRelationKindText(typeRelation.kind);
    },
    async addRelation() {
      const { registry } = this;

      const result = await getEditRelation({
        registry,
      });

      if (result) {
        this.relations = this.registry.defs.getRelations(this.name);
      }
    },
    async editRelation(typeRelation: TypeRelation) {
      const { registry } = this;
      
      const result = await getEditRelation({
        registry,  
        relation: typeRelation.relation,
      });

      if (result) {
        this.relations = this.registry.defs.getRelations(this.name);
      }
    },
    async removeRelation(typeRelation: TypeRelation) {
      const relations = this.registry.defs.relations;

      if (typeRelation.relation.name in relations && await getConfirmation()) {
        this.relations.splice(this.relations.indexOf(typeRelation), 1);

        Vue.delete(relations, typeRelation.relation.name);
      }
    },
    getTypeDescription(type: Type) {
      return this.registry.getTypeDescribe(type);
    },
    getExpressionDescription(ex: Expression) {
      return this.registry.getExpressionDescribe(ex);
    },
    triggerSave(done: boolean) {
      this.$emit('saved', this);
      if (done) {
        this.done(true);
      } else {
        this.save();
      }
    },
    handleChange(event: TypeUpdateEvent) {
      const { type, settings, transform } = event;
      
      if (transform instanceof Expression && this.data && this.data.length)
      {
        const cmd = LiveRuntime.getCommand(transform);

        for (let i = 0; i < this.data.length; i++)
        {
          this.data[i] = cmd({ value: this.data[i] });
        }
      }

      if (this.type === this.registry.defs.aliased[this.name]) {
        Vue.set(this.registry.defs.aliased, this.name, type);
      }

      this.type = type as ObjectType;
      this.settings = settings;
    },
  },
});
</script>
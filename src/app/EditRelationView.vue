<template>
  <div>
    <ex-namer
      v-if="!hideName"
      auto-validate
      :validate="validateName"
      :value="relationData.name"
      @input="renamed"
      @remove="remove"
    ></ex-namer>

    <v-tabs vertical icons-and-text background-color="grey lighten-3">
      <v-tab>
        <v-icon>mdi-axis-arrow</v-icon>
        Edit
      </v-tab>
      <v-tab>
        <v-icon>mdi-swap-horizontal-bold</v-icon>
        Refs
      </v-tab>
      <v-tab-item>
        <v-container>
          <v-row no-gutters>
            <v-col cols="12">
              <v-select
                outlined
                persistent-hint
                class="mt-3"
                label="Kind"
                :error="invalidKind"
                :hint="hintKind"
                :items="kindOptions"
                v-model="kind"
              ></v-select>
            </v-col>
          </v-row>
          <!-- Has Many -->
          <v-row no-gutters v-if="isHasMany">
            <v-col cols="12" sm="6">
              <v-select
                outlined
                persistent-hint
                class="mr-1 mt-3"
                label="Has Many"
                hint="The type which has many related"
                :error="invalidOne"
                :items="entityOptions"
                v-model="relationData.one"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                persistent-hint
                class="ml-1 mt-3"
                label="Has Many Relation Name"
                :hint="hintHasManyOne"
                v-model="relationData.oneRelationName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                outlined
                persistent-hint
                class="mr-1 mt-3"
                label="Many"
                hint="The type which belongs to One"
                :error="invalidMany"
                :items="entityOptions"
                v-model="relationData.many"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                persistent-hint
                class="ml-1 mt-3"
                label="Many Relation Name"
                :hint="hintHasManyMany"
                v-model="relationData.manyRelationName"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-switch
                persistent-hint
                class="ml-3"
                label="Owns"
                hint="If One owns the Many than the Many are removed when the One is deleted"
                v-model="relationData.owns"
              ></v-switch>
            </v-col>
          </v-row>
          <!-- Has One -->
          <v-row v-else-if="isHasOne">
            <v-col cols="12" sm="6">
              <v-select
                outlined
                persistent-hint
                class="mr-1 mt-3"
                label="Has One"
                hint="The type which has one related"
                :error="invalidHasOne"
                :items="entityOptions"
                v-model="relationData.hasOne"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                persistent-hint
                class="ml-1 mt-3"
                label="Has One Relation Name"
                :hint="hintHasOneHasOne"
                v-model="relationData.hasOneRelationName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                outlined
                persistent-hint
                class="mr-1 mt-3"
                label="One"
                hint="The type which belongs to One"
                :error="invalidOne"
                :items="entityOptions"
                v-model="relationData.one"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                persistent-hint
                class="ml-1 mt-3"
                label="One Relation Name"
                :hint="hintHasOneOne"
                v-model="relationData.oneRelationName"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-switch
                persistent-hint
                class="ml-3"
                label="Owns"
                hint="If Has One owns the One than the One is removed when the Has One is deleted"
                v-model="relationData.owns"
              ></v-switch>
            </v-col>
            <v-col>
              <v-switch
                persistent-hint
                class="ml-3"
                label="Required"
                hint="Has One must always have a One"
                v-model="relationData.required"
              ></v-switch>
            </v-col>
          </v-row>
          <!-- Has One Polymorphic -->
          <v-row v-else-if="isHasOnePolymorphic">
            <v-col cols="12" sm="6">
              <v-select
                outlined
                persistent-hint
                class="mr-1 mt-3"
                label="Has One"
                hint="The type which has one related"
                :error="invalidHasOne"
                :items="entityOptions"
                v-model="relationData.hasOne"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                persistent-hint
                class="ml-1 mt-3"
                label="Has One Relation Name"
                :error="invalidHasOneRelationName"
                :hint="hintHasOnePolymorphicHasOne"
                v-model="relationData.hasOneRelationName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                outlined
                multiple
                persistent-hint                
                class="mr-1 mt-3"
                label="One"
                hint="The types which belongs to One"
                :error="invalidPoly"
                :items="entityOptions"
                v-model="relationData.poly"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                persistent-hint
                class="ml-1 mt-3"
                label="One Relation Name"
                :hint="hintHasOnePolymorphicOne"
                v-model="relationData.polyRelationName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-combobox
                outlined
                persistent-hint
                class="mr-1 mt-3"
                label="Discriminator"
                hint="A field added to Has One which distinguishes which type is related"
                :items="morphsPropertyOptions"
                v-model="relationData.morphs[0]"
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                outlined
                persistent-hint
                class="ml-1 mt-3"
                label="Type"
                hint="The field type that stores the discriminator"
                :items="morphsTypeOptions"
                :value-comparator="morphsTypesComparator"
                v-model="relationData.morphs[1]"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-simple-table class="ex-table-fixed mt-3">
                <colgroup>
                  <col style="width: 30%">
                  <col style="width: 70%">
                </colgroup>
                <thead class="v-data-table--dense">
                  <tr class="grey lighten-3">
                    <th>Type</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="name in relationData.poly">
                    <tr :key="name">
                      <td>{{ name }}</td>
                      <td>
                        <ex-type-input
                          :registry="registry"
                          :type="relationData.morphs[1]"
                          :settings="morphsTypeSettings"
                          v-model="relationData.morphsToRelated[name]"
                        ></ex-type-input>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </v-simple-table>
            </v-col>
            <v-col>
              <v-switch
                persistent-hint
                class="ml-3"
                label="Owns"
                hint="If Has One owns the One than the One is removed when the Has One is deleted"
                v-model="relationData.owns"
              ></v-switch>
            </v-col>
            <v-col>
              <v-switch
                persistent-hint
                class="ml-3"
                label="Required"
                hint="Has One must always have a One"
                v-model="relationData.required"
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>  
      </v-tab-item>
      <v-tab-item>
        <p v-if="references.length === 0" class="pa-3">
          <v-alert type="info">
            This Relation is not referenced by anything.
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
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ObjectType, MapInput, EntityPropPair, Types, objectEach, objectToArray, objectValues, RelationKind, Relation, DefinitionsRelationReference } from 'expangine-runtime';
import { ListOptions, ListOption } from '@/common';
import { sendNotification } from '@/app/Notify';
import { getConfirmation } from '@/app/Confirm';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { Registry } from '@/runtime/Registry';
import { Preferences, PreferenceCategory } from './Preference';



export interface RelationData
{
  name: string;                   // hasMany hasOne
  one: string;                    // hasMany hasOne
  many: string;                   // hasMany
  oneRelationName: string;        // hasMany hasOne
  manyRelationName: string;       // hasMany
  foreignKeyPrefix: string;       // hasMany hasOne hasOnePolymorphic
  owns: boolean;                  // hasMany hasOne hasOnePolymorphic
  hasOne: string;                 // hasOne hasOnePolymorphic
  required: boolean;              // hasOne hasOnePolymorphic
  hasOneRelationName: string;     // hasOne hasOnePolymorphic
  morphs: EntityPropPair;         // hasOnePolymorphic
  morphsToRelated: MapInput<any, string>; // hasOnePolymorphic
  poly: string[];                 // hasOnePolymorphic
  polyRelationName: string;       // hasOnePolymorphic
}

const PREF_REMOVE_RELATION = Preferences.define({
  key: 'relation_remove',
  label: 'Remove relation without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    relation: { 
      type: Object as () => Relation,
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
    relationData: null as any as RelationData,
    kind: null as null | RelationKind,
    updatingData: false,
  }),
  computed: { 
    references(): DefinitionsRelationReference[] {
      return this.registry.defs.getRelationReferences(this.relation);
    },
    kindOptions(): ListOptions<RelationKind> {
      return [
        { text: 'Has Many', value: RelationKind.HAS_MANY, description: 'One type is related to any number of instances of another type.' },
        { text: 'Has One', value: RelationKind.HAS_ONE, description: 'One type is related to one instance of another type.' },
        { text: 'Has One Polymorphic', value: RelationKind.HAS_ONE_POLYMORPHIC, description: 'One type is related to one instance of any number of types.' },
      ];
    },
    entityOptions(): ListOptions<string> {
      return this.registry.defs.entities.values
        .filter((entity) => entity.canStore(this.registry.defs))
        .map((entity) => ({
          text: entity.name,
          value: entity.name,
        }))
      ;
    },
    kindOption(): ListOption<RelationKind> | null { 
      return this.kindOptions.find((option) => option.value === this.kind) || null;
    },
    hintKind(): string {
      return this.kindOption
        ? this.kindOption.description || ''
        : '';
    },
    invalidName(): boolean {
      const name = this.relationData.name || this.relationName;

      if (!name) {
        return false;
      }
      const existing = this.registry.defs.relations.get(name);

      if ((this.relation && existing !== this.relation) || (!this.relation && existing)) {
        return true;
      }
      return false;
    },
    invalidKind(): boolean  {
      return this.kind === null;
    },
    isHasMany() {
      return this.kind === RelationKind.HAS_MANY;
    },
    isHasOne() {
      return this.kind === RelationKind.HAS_ONE;
    },
    isHasOnePolymorphic() {
      return this.kind === RelationKind.HAS_ONE_POLYMORPHIC;
    },
    invalidHasManyRelation(): boolean {
      const { one, many } = this.relationData;

      return !one || !many;
    },
    invalidHasOneRelation(): boolean {
      const { hasOne, one } = this.relationData;

      return !one || !hasOne;
    },
    invalidHasOnePolymorphicRelation(): boolean {
      const { hasOne, morphs, morphsToRelated, poly, hasOneRelationName } = this.relationData;

      return !hasOne || !morphs || !morphs[0] || !morphs[1] || poly.length < 2 || !hasOneRelationName;
    },
    invalidOne(): boolean {
      return !this.relationData.one;
    },
    invalidMany(): boolean {
      return !this.relationData.many;
    },
    invalidHasOne(): boolean {
      return !this.relationData.hasOne;
    },
    invalidHasOneRelationName(): boolean {
      return !this.relationData.hasOneRelationName;
    },
    invalidPoly(): boolean {
      return this.relationData.poly.length < 2;
    },
    relationName(): string {
      const { kind, relationData } = this;
      const { one, many, hasOne, oneRelationName, manyRelationName, hasOneRelationName, polyRelationName } = relationData;
      let parts = ['', '', ''];

      switch (kind) {
        case RelationKind.HAS_MANY:
          parts = [manyRelationName || one, 'hasMany', oneRelationName || many];
          break;
        case RelationKind.HAS_ONE:
          parts = [hasOneRelationName || one, 'hasOne', oneRelationName || hasOne];
          break;
        case RelationKind.HAS_ONE_POLYMORPHIC:
          parts = [hasOneRelationName, '_hasOnePolymorphic_', polyRelationName || hasOne];
          break;
      }

      return parts[0] && parts[2]
        ? parts.join('_')
        : '';
    },
    hintName(): string {
      const name = this.relationData.name || this.relationName;

      return this.invalidName
        ? `The name "${name}" is already in use`
        : this.relationName
          ? `The name defaults to "${this.relationName}"`
          : `The name will be auto-populated if you don't enter anything`;
    },
    hintHasManyOne(): string {
      const { many, oneRelationName } = this.relationData;

      return many && !oneRelationName
        ? `Defaults to "${many}"`
        : 'The name of the relation on the One type';
    },
    hintHasOneHasOne(): string {
      const { one, hasOneRelationName } = this.relationData;

      return one && !hasOneRelationName
        ? `Defaults to "${one}"`
        : 'The name of the relation on the Has One type';
    },
    hintHasOnePolymorphicHasOne(): string {
      return 'The name of the relation on the Has One type';
    },
    hintHasOnePolymorphicOne(): string {
      const { hasOne, polyRelationName } = this.relationData;

      return hasOne && !polyRelationName
        ? `Defaults to "${hasOne}"`
        : 'The name of the relation on the One types';
    },
    hintHasOneOne(): string {
      const { hasOne, oneRelationName } = this.relationData;

      return hasOne && !oneRelationName
        ? `Defaults to "${hasOne}"`
        : 'The name of the relation on the One type';
    },
    hintHasManyMany(): string {
      const { one, manyRelationName } = this.relationData;

      return one && !manyRelationName
        ? `Defaults to "${one}"`
        : 'The name of the relation on the Many type';
    },
    morphsTypeOptions(): ListOptions<Type> {
      return [
        { text: 'Text', value: Types.text() },
        { text: 'Number', value: Types.number() },
        { text: 'Whole Number', value: Types.int() },
        { text: 'Boolean', value: Types.bool() },
        { text: 'Enum', value: Types.enumForText(this.relationData.poly) },
      ];
    },
    morphsPropertyOptions(): ListOptions<string> {
      const hasOne = this.registry.defs.getEntity(this.relationData.hasOne);

      if (!hasOne) {
        return [];
      }

      return objectToArray(hasOne.type.options.props, (_, value) => ({
        value,
        text: value,
      }));
    },
    morphsTypeSettings(): TypeSettings {
      return this.registry.getTypeSettings(this.relationData.morphs[1]);
    },
    disableSave(): boolean {
      return this.invalidName 
        || this.kind === null
        || (this.isHasMany && this.invalidHasManyRelation)
        || (this.isHasOne && this.invalidHasOneRelation)
        || (this.isHasOnePolymorphic && this.invalidHasOnePolymorphicRelation);
    },
  },
  watch: {
    relation: {
      immediate: true,
      handler(relation: Relation) {
        if (this.updatingData) {
          this.updatingData = false;
        } else {
          this.relationData = this.getRelationData();
          this.kind = relation.kind;
        }
      },
    },
    relationData: {
      deep: true,
      handler(relationData: RelationData) {
        const { registry: { defs }, kind } = this;

        if (!this.disableSave && kind !== null) {
          const relation = this.getRelationFromData();

          if (relation) {
            this.updatingData = true;
            defs.addRelation(relation);
          }
        }
      },
    },
  },
  methods: {
    renamed(newName: string) {
      const { registry, relation } = this;
      const { defs } = registry;

      if (relation.name) {
        const updates = this.registry.defs.renameRelation(relation, newName);

        if (updates && updates.length) {
          sendNotification({ message: `${updates.length} Function reference(s) updated.` });
        }
      } else {
        relation.name = newName;

        this.registry.defs.addRelation(relation);
      }
    },
    validateName(name: string) {
      if (!name) {
        return 'A name is required.';
      }

      const existing = this.registry.defs.getRelation(name);
      if (existing && existing !== this.relation) {
        return 'A relation already exists with that name.';
      }

      return '';
    },
    async remove() {
      const refs = this.references.length;

      if (!await getConfirmation({ message: `Are you sure you want to remove this function? It is referenced ${refs} times.`, pref: PREF_REMOVE_RELATION })) {
        return;
      }

      if (!this.registry.defs.removeRelation(this.relation)) {
        sendNotification({ message: 'You cannot remove a referenced function. '});
      } else {
        this.$emit('remove', this.relation);
      }
    },
    morphsTypesComparator(a: Type, b: Type) {
      return a.getId() === b.getId();
    },
    getRelationFromData() {
      switch (this.kind) {
        case RelationKind.HAS_MANY:
          return Relation.hasMany(this.registry.defs, this.relationData);
        case RelationKind.HAS_ONE:
          return Relation.hasOne(this.registry.defs, this.relationData);
        case RelationKind.HAS_ONE_POLYMORPHIC:
          return Relation.hasOnePolymorphic(this.registry.defs, this.relationData);
      }
    },
    getRelationDataDefaults(): RelationData {
      return {
        name: '',
        one: '',
        many: '',
        oneRelationName: '',
        manyRelationName: '',
        foreignKeyPrefix: '',
        owns: false,
        hasOne: '',
        required: false,
        hasOneRelationName: '',
        morphs: ['discriminator', Types.text()],
        morphsToRelated: {},
        poly: [],
        polyRelationName: '',
      };
    },
    getRelationData() {
      const relation = this.relation;
      const data = this.getRelationDataDefaults();

      switch (relation.kind)
      {
        case RelationKind.HAS_MANY:
          data.name = relation.name;
          data.one = relation.related[0].name;
          data.oneRelationName = relation.relatedRelationName;
          data.many = relation.subject.name;
          data.manyRelationName = relation.subjectRelationName;
          data.foreignKeyPrefix = relation.subjectRelationName + '_';
          data.owns = relation.owns;
          break;

        case RelationKind.HAS_ONE:
          data.name = relation.name;
          data.hasOne = relation.subject.name;
          data.hasOneRelationName = relation.subjectRelationName;
          data.one = relation.related[0].name;
          data.oneRelationName = relation.relatedRelationName;
          data.foreignKeyPrefix = relation.subjectRelationName + '_';
          data.required = relation.required;
          data.owns = relation.owns;
          break;

        case RelationKind.HAS_ONE_POLYMORPHIC:
          const map = Array.from(relation.morphsToRelated.entries());

          data.name = relation.name;
          data.hasOne = relation.subject.name;
          data.hasOneRelationName = relation.subjectRelationName;
          data.poly = relation.related.map((related) => related.name);
          data.polyRelationName = relation.relatedRelationName;
          data.morphs = relation.morphs as EntityPropPair;
          data.morphsToRelated = map.reduce((obj, [prop, value]) => (obj[prop] = value, obj), {} as Record<string, any>);
          data.foreignKeyPrefix = relation.subjectRelationName + '_';
          data.required = relation.required;
          data.owns = relation.owns;
          break;
      }

      return data;
    },
  },
});
</script>
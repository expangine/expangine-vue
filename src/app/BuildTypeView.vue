<template>
  <v-card>
    <v-card-title 
      class="headline" 
      v-html="title"
    ></v-card-title>
    <v-card-text>
      <v-select
        solo
        filled
        return-object
        :value-comparator="compareStrict"
        :items="wrappers"
        v-model="wrapper"
      >
        <template #item="{ item, on, attrs }">
          <v-list-item v-on="on" v-bind="attrs">
            <v-list-item-content>
              <v-list-item-title 
                v-html="item.text"
              ></v-list-item-title>
              <v-list-item-subtitle 
                v-html="item.description"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-autocomplete
        solo
        filled
        return-object
        auto-select-first
        placeholder="- Select Type -"
        :hint="hint"
        :persistent-hint="persistentHint"
        :value-comparator="compareStrict"
        :items="options"
        :multiple="isMultiple"
        v-focus-on-create="'input'"
        v-model="types"
      >
        <template #item="{ item, on, attrs }">
          <v-list-item v-on="on" v-bind="attrs">
            <v-list-item-icon v-if="isMultiple">
              {{ indexOf(item) }}
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title 
                v-html="item.text"
              ></v-list-item-title>
              <v-list-item-subtitle 
                v-html="item.description"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-autocomplete>
      <v-switch
        inset
        hide-details
        label="Optional"
        v-model="optional"
      ></v-switch>
    </v-card-text>
    <v-card-actions>
      <v-btn 
        color="primary"
        :disabled="disableOk"
        v-html="ok" 
        @click="handle(true)"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn 
        color="secondary"
        v-html="cancel" 
        @click="handle(false)"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { friendlyList, asArray } from '../common';
import { TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { TypeBuildOption, TypeBuilderWrapOption, TypeBuildInput } from '../runtime/types/TypeBuilder';
import { OptionalModifierTransform } from '../runtime/types/optional';


export default Vue.extend({
  props: {
    input: {
      type: Object as () => TypeBuildInput,
      required: true,
    },
    title: {
      type: String,
      default: 'Choose Type',
    },
    ok: {
      type: String,
      default: 'Ok',
    },
    cancel: {
      type: String,
      default: 'Cancel',
    },
  },
  data: () => ({
    optional: false,
    types: null as null | TypeBuildOption[] | TypeBuildOption,
    wrapper: null as null | TypeBuilderWrapOption,
  }),
  computed: {
    options(): TypeBuildOption[] {
      return this.input.registry.getTypeBuildersFor(this.input);
    },
    wrappers(): TypeBuilderWrapOption[] {
      return this.input.registry.getTypeBuilderWrappersFor(this.input);
    },
    selectedTypes(): TypeBuildOption[] {
      return asArray(this.types);
    },
    hint(): string {
      return friendlyList(this.selectedTypes.map((t) => t.description || '').filter((d) => !!d));
    },
    persistentHint(): boolean {
      return !!this.hint;
    },
    allowsDuplicate(): boolean {
      return !!(this.wrapper && this.wrapper.allowDuplicates);
    },
    isMultiple(): boolean {
      return !!(this.wrapper && this.wrapper.multiple);
    },
    disableOk(): boolean {
      const types = asArray(this.types);

      return types.length === 0 || !this.wrapper;
    },
  },
  watch: {
    wrappers: {
      immediate: true,
      handler() {
        this.wrapper = this.wrappers[0] || null;
      },
    },
  },
  methods: {
    compareStrict(a: any, b: any): boolean {
      return a === b;
    },
    indexOf(option: TypeBuildOption): string {
      const i = this.selectedTypes.indexOf(option);
      return i === -1 ? '' : `[${i}]`;
    },
    async getChosenType(): Promise<TypeUpdateEvent | null> {
      const types = asArray(this.types);

      if (this.wrapper && types.length > 0) {
        const chosens: TypeUpdateEvent[] = [];

        for (const type of types) {
          const chosen = await type.value();

          if (chosen) {
            chosens.push(chosen);
          }
        }

        if (chosens.length === 0) {
          return null;
        }

        const wrapped = await this.wrapper.value(chosens);

        if (!wrapped) {
          return null;
        }

        return this.optional
          ? OptionalModifierTransform(this.input.registry, wrapped.type, wrapped.settings)
          : wrapped;
      } 

      return null;
    },
    async handle(ok: boolean) {
      if (ok) {
        const chosen = await this.getChosenType();

        if (chosen) {
          return this.$emit('ok', chosen);
        }
      }

      this.$emit('cancel');
    },
  },
});
</script>
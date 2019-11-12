<template>
  <v-dialog v-model="visible" max-width="800" :fullscreen="$vuetify.breakpoint.mdAndDown">
    <v-card>
      <v-card-title class="headline">
        Operation Catalogue
      </v-card-title>
      <v-card-text>

        <v-text-field
          outlined
          hide-details
          class="mt-3"
          label="Filter Operations"
          v-model="query"
        ></v-text-field>

        <v-sheet max-height="60vh" elevation="1" class="ex-scrollable mt-3">
          <v-list>
            <template v-for="(item, index) in items">
              <v-list-item :key="index" @click="view(item.value)">
                <v-list-item-content>
                  <v-list-item-title v-html="item.text"></v-list-item-title>
                  <v-list-item-subtitle v-html="item.description"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-sheet>

        <ex-operation-info-dialog
          :show.sync="viewing"
          :name="viewingName"
          :registry="registry"
        ></ex-operation-info-dialog>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="visible = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { ListOptionsTokenized } from '../common';
import { OperationPair } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { filterOperation, sortListOptionByCount, sortListOption, getListOption } from '../runtime/exprs/operation/helpers';


export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  data: () => ({
    query: '',
    viewingName: '',
    viewing: false,
  }),
  computed: {
    visible: {
      get(): boolean {
        return this.show;
      },
      set(visible: boolean)  {
        this.$emit('update:show', visible);
      },
    },
    items(): ListOptionsTokenized<OperationPair> {
      let items = this.registry.defs.getOperations()
        .filter((pair) => this.registry.isValidOperation(pair))
        .map((pair) => getListOption(this.registry, pair))
      ;

      if (this.query) {
        items = items.filter((item) => filterOperation(item, this.query, item.text));
        items.sort(sortListOptionByCount(this.query));
      } else {
        items.sort(sortListOption);
      }

      return items;
    },
  },
  methods: {
    view(value: OperationPair) {
      this.viewingName = value.op.id;
      this.viewing = true;
    },
  },
});
</script>
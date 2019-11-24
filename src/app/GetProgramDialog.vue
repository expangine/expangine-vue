<template>
  <v-dialog v-model="visible" max-width="1000" :fullscreen="$vuetify.breakpoint.mdAndDown">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <p v-if="message" v-html="message"></p>
        <v-tabs v-if="hasTabs">
          <v-tab>{{ programLabel }}</v-tab>
          <v-tab>Return Type</v-tab>
          <v-tab-item>
            <ex-expression
              v-model="program"
              :context="context"
              :registry="registry"
              :required-type="expectedType"
            ></ex-expression>
          </v-tab-item>
          <v-tab-item>
            <code 
              class="d-block pa-2 ma-1 ex-scrollable" 
              v-html="actualTypeDescribed"
            ></code>
          </v-tab-item>
        </v-tabs>
        <ex-expression
          v-else
          v-model="program"
          :context="context"
          :registry="registry"
          :required-type="expectedType"
        ></ex-expression>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="secondary"
          @click="cancel"
        >{{ unconfirm }}</v-btn>
        <v-spacer></v-spacer>
        <v-alert 
          v-if="isInvalid"
          dense
          type="error"
          class="mb-0 mr-3"
        >Your expression does not return correct type.</v-alert>
        <v-btn 
          color="primary"
          @click="ok"
          :disabled="isDisabled"
        >{{ confirm }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
import { getProgramDialog } from './GetProgram';


export default Vue.extend({
  data: () => getProgramDialog,
  computed: {
    hasTabs(): boolean {
      return !this.expectedType;
    },
    actualType(): Type | null {
      return this.program.getType(this.registry.defs, this.context);
    },
    actualTypeDescribed(): string {
      return this.actualType
        ? this.registry.getTypeDescribeLong(this.actualType, '&nbsp;&nbsp;', '<br>')
        : '';
    },
    isDisabled(): boolean {
      return !this.actualType;
    },
    isInvalid(): boolean {
      const { actualType, expectedType } = this;

      return !!(expectedType && (!actualType || !expectedType.acceptsType(actualType)));
    },
  },
  methods: {
    cancel() {
      this.close(false);
    },
    ok() {
      this.close(true);
    },
  },
});
</script>
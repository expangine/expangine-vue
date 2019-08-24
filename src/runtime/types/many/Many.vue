<template>
  <v-list-item>
    <v-list-item-avatar class="mr-0">
      <v-menu>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-icon v-on="on">mdi-delta</v-icon>
              </template>
              <span>Change Type</span>
            </v-tooltip>
          </v-btn>
        </template>
        <v-list>
          <template v-for="innerType in type.options">
            <v-list-item 
              :key="innerType.getId()" 
              :disabled="isDisabledType(innerType)"
              @click="changeType(innerType)">
              Change to {{ registry.getVisuals(innerType).name }}
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-list-item-avatar>
    <v-list-item-content class="pa-1">
      <ex-type-input
        :value="value"
        :type="subType"
        :read-only="readOnly"
        :registry="registry"
        :settings="subTypeSettings"
        @input="input"
      ></ex-type-input>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Type, ManyType } from 'expangine-runtime';
import { ManyOptions, ManySubs } from './ManyTypes';
import { PropTypeAny } from '../../../common';
import { TypeSettings } from '../../TypeVisuals';
import { confirm } from '../../../app/Confirm';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ManyType, ManyOptions, any, ManySubs>(PropTypeAny).extend({
  name: 'Many',
  data: () => ({
    currentType: null as null | Type,
  }),
  computed: {
    subType(): Type {
      return this.currentType || this.type.getExactType(this.value);
    },
    subTypeSettings(): TypeSettings<any, any> {
      return this.settings.sub[this.subType.getId()];
    },
  },
  methods: {
    isDisabledType(innerType: Type) {
      return innerType === this.subType;
    },
    async changeType(innerType: Type) {
      if (!await confirm()) {
        return;
      }

      const subSettings = this.settings.sub[innerType.getId()];
      const newValue = innerType.isValid(this.value)
        ? this.value
        : innerType.fromJson(subSettings.defaultValue);
      
      this.currentType = innerType;
      this.$emit('input', newValue);
      this.$forceUpdate();
    },
  },
});
</script>

<style lang="sass" scoped>

</style>

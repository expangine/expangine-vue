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
              Change to {{ registry.getTypeVisuals(innerType).name }}
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-list-item-avatar>
    <v-list-item-content class="pa-1">
      <ex-type-input
        :type="subType"
        :read-only="readOnly"
        :registry="registry"
        :settings="subTypeSettings"
        :path="path"
        v-model="computedValue"
      ></ex-type-input>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Type, ManyType } from 'expangine-runtime';
import { getConfirmation } from '../../../app/Confirm';
import { TypeSettings } from '../TypeVisuals';
import { ManyOptions, ManySubs } from './ManyTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ManyType, ManyOptions, any, ManySubs>().extend({
  name: 'Many',
  data: () => ({
    currentType: null as null | Type,
  }),
  computed: {
    subType(): Type {
      return this.currentType || this.type.getExactType(this.computedValue) || this.type.options[0];
    },
    subTypeIndex(): number {
      return this.type.options.indexOf(this.subType);
    },
    subTypeSettings(): TypeSettings<any, any> {
      return this.settings.sub[this.subTypeIndex];
    },
  },
  methods: {
    isDisabledType(innerType: Type) {
      return innerType === this.subType;
    },
    async changeType(innerType: Type) {
      if (!await getConfirmation()) {
        return;
      }

      const innerIndex = this.type.options.indexOf(innerType);
      const subSettings = this.settings.sub[innerIndex];
      const newValue = innerType.isValid(this.computedValue)
        ? this.computedValue
        : innerType.fromJson(subSettings.defaultValue);
      
      this.currentType = innerType;
      this.computedValue = newValue;
      this.$forceUpdate();
    },
  },
});
</script>
<template>
  <span>
    <span>
      <template v-for="(segment, index) in value.path">
        <get-segment
          v-bind="$props"
          v-on="$listeners"
          :key="index"
          :index="index"
          @input="update"
        ></get-segment>
      </template>
    </span>

    <v-menu offset-y v-if="computedSubTypes.length > 0">
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="(sub, index) in computedSubTypes">
          <v-list-item :key="index" @click="addSegment(sub)">
            <v-list-item-content>
              <v-list-item-title>{{ sub.text }}</v-list-item-title>
              <v-list-item-subtitle>{{ sub.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, GetExpression, TypeSub, Type, TypeBuilder, ExpressionBuilder } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import ExpressionBase from '../ExpressionBase';
import GetSegment from './GetSegment.vue';
import { TypeVisuals } from '../../types/TypeVisuals';



const ex = new ExpressionBuilder();
const tp = new TypeBuilder();

export default ExpressionBase<GetExpression>().extend({
  name: 'GetEditor',
  components: {
    GetSegment,
  },
  computed: {
    computedSubTypes(): TypeSub[] {
      return this.computedType
        ? this.registry.getTypeSubOptions(this.computedType)
        : this.registry.getTypeSubOptions(this.context);
    },
  },
  methods: {
    updateSegment(segment: Expression, index: number) {
      this.$set(this.value.path, index, segment);
    },
    addSegment(sub: TypeSub) {
      if (sub.key instanceof Type) {
        const visual = this.registry.getTypeVisuals(sub.key);
        const segment = ex.const(visual.type.baseType.create());
        this.value.path.push(segment);
      } else {
        const segment = ex.const(sub.key);
        this.value.path.push(segment);
      }

      this.update();
    },
  },
});
</script>
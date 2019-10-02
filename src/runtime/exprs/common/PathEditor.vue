<template>
  <span>
    <path-segment
      v-if="hasSegment"
      v-bind="$props"
      :index="0"
      :sub-settings="settings"
      @input="update"
      @remove="remove"
    ></path-segment>
    <v-menu offset-y v-if="nextSegments.length > 0">
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="(sub, index) in nextSegments">
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
import { Expression, Type, NoExpression, ExpressionBuilder } from 'expangine-runtime';
import { TypeSubOption } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';
import PathSegment from './PathSegment.vue';


const ex = new ExpressionBuilder();

export default ExpressionBase().extend({
  name: 'PathEditor',
  components: {
    PathSegment,
  },
  props: {
    path: {
      type: Array as () => Expression[],
      required: true,
    },
  },
  computed: {
    hasSegment(): boolean {
      return this.path.length > 0;
    },
    pathType(): Type | null {
      return this.registry.defs.getPathType(this.path, this.context);
    },
    nextSegments(): TypeSubOption[] {
      return this.registry.getTypeSubOptions(this.pathType || this.context);
    },
  },
  methods: {
    addSegment(sub: TypeSubOption) {
      if (sub.key instanceof Type) {
        const visual = this.registry.getTypeVisuals(sub.key);
        const segment = ex.const(visual.type.baseType.create());
        this.path.push(segment);
      } else {
        const segment = ex.const(sub.key);
        this.path.push(segment);
      }

      this.update();
    },
  },
});
</script>
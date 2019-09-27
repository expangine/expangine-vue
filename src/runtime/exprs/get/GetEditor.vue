<template>
  <div>
    <template v-for="(segment, index) in value.path">
      <ex-expression
        :key="index"
        :value="segment"
        :required-type="pathType"
        :context="context"
        :read-only="readOnly"
        :registry="registry"
        :show-complexity="showComplexity"
        @input="updateSegment($event, index)"
      ></ex-expression>
    </template>
    <v-select
      v-model="nextSub"
      label=">"
      :items="computedSubTypeOptions"
      @input="addSegment"
    ></v-select>
    <span> => {{ computedType.getId() }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, GetExpression, TypeSub, Type, TypeBuilder, ExpressionBuilder } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { ListOptions } from '../../../common';


const ex = new ExpressionBuilder();
const tp = new TypeBuilder();

export default ExpressionBase<GetExpression>().extend({
  name: 'GetEditor',
  data: () => ({
    nextSub: null as null | TypeSub,
    pathType: tp.many(tp.text(), tp.number()),
  }),
  computed: {
    computedSubTypes(): TypeSub[] {
      return this.computedType
        ? this.computedType.getSubTypes(this.registry.defs)
        : this.context.getSubTypes(this.registry.defs);
    },
    computedSubTypeOptions(): ListOptions<TypeSub> {
      return this.computedSubTypes.map(this.getSubOption);
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
    getSubOption(sub: TypeSub) {
      if (sub.key instanceof Type) {
        const visual = this.registry.getTypeVisuals(sub.key);
        return {
          text: visual.name,
          description: visual.description,
          value: sub,
        };
      } else {
        return {
          text: sub.key + '',
          value: sub,
        };
      }
    },
  },
});
</script>
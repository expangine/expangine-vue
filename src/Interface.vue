<template>
  <div>
    <div class="design-left">
      <ex-draggable
        v-model="previews"
        :group="{ name: 'nodes', pull: 'clone', put: true }"
        :sort="false"
        :clone="clonePreview"
      >
        <template v-for="(preview, index) in previews">
          <ex-component-preview
            :key="index"
            :template="preview.preview"
          ></ex-component-preview>
        </template>
      </ex-draggable>
      <v-btn color="primary" @click="preview">
        <v-icon>mdi-play</v-icon>
        Preview
      </v-btn>
    </div>
    <div class="design-center">
      <ex-node-children
        v-model="root"
        :registry="registry"
        :context="context"
        @select="setSelection"
      ></ex-node-children>
    </div>
    <div class="design-right">
      <div v-if="selection">
        <ex-node-editor
          :value="selection.node"
          :context="selection.context"
          :registry="registry"
          @input="updateSelection"
        ></ex-node-editor>
      </div>
    </div>
    <v-dialog fullscreen v-model="previewing">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closePreview">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Preview</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div ref="previewTarget">
          <div></div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Exprs, Types, NumberOps, ListOps, DataTypes, Type, Expression, isNumber } from 'expangine-runtime';
import { ComponentRegistry, Component, mount, addComponent, createIf, createFor, createComponent, NodeTemplateChild } from 'expangine-ui';
import * as ui from 'expangine-ui';
import { Button, Modal, registerComponents } from 'expangine-ui-bulma';
import { NodePreview } from './ui/nodes/NodePreview';
import { NodeSelection } from './ui/nodes/NodeVisuals';
import { Documentation } from './ui/Documentation';
import registry from './runtime';
import Expressions from 'expangine-runtime-live/typings/Expressions';


export default Vue.extend({
  data: () => ({
    registry,
    previews: [] as NodePreview[],
    data: {
      list: [1, 2, 3],
    },
    context: Types.object({
      list: Types.list(Types.number()),
    }),
    root: [] as NodeTemplateChild[],
    selection: null as null | NodeSelection,
    previewing: false,
  }),
  async mounted() {
    registerComponents(ComponentRegistry);

    DataTypes.addCopier({
      priority: 10,
      copy: (a, copy) => {
        if (a instanceof Expression) {
          return a.clone();
        }
      },
    });

    this.previews = this.registry.getNodePreviews();

    (window as any).inter = this;
    (window as any).ui = ui;
    (window as any).doc = Documentation;

/*
    this.addComponents();

    (window as any).google.charts.load('current', {packages: ['corechart']});

    (window as any).ComponentRegistry = ComponentRegistry;

    (window as any).ui = ui;

    (window as any).mounted = mount({ 
      times: 1, 
      list: ['a', 'b', 'c'], 
      dynamicList: [],
      visible: 0,
    }, ['div', { style: 'width: 600px' }, {}, [
      createComponent(Button, {}, {
        click: Exprs
          .update(Exprs.get(), 'times')
          .to(Exprs.op(NumberOps.add, { 
            value: Exprs.get('current'), 
            addend: Exprs.const(1),
          })),
      }, {
        default: [
          Exprs.template('Clicked {count} times', { count: Exprs.get('times') }),
        ],
      }),
      createComponent(Button, {}, {
        click: Exprs.get('visible').set(Exprs.true()),
      }, {
        default: ['Show Modal'],
      }),
      createComponent(Modal, {
        open: Exprs.get('visible'),
        card: true,
        title: 'Title',
      }, {
        close: Exprs.get('visible').set(Exprs.false()),
      }, {
        default: ['Content'],
        footer: ['Footer'],
      }),
      ['br'],
      createIf(Exprs.op(NumberOps.isDivisible, { value: Exprs.get('times'), by: 2 }), [
        'It is even!',
      ]),
      ['br'],
      createFor(Exprs.get('list'), [
        Exprs.template('{k}: {v} ({count})', {
            k: Exprs.get('index'),
            v: Exprs.get('item'),
            count: Exprs.get('times'),
        }),
        ['br'],
      ]),
      ['googlecharts/pie', {
        title: Exprs.template('My Daily Activities {count}', { count: Exprs.get('times') }),
        label: Exprs.const('Task'),
        value: Exprs.const('Hours per Day'),
        data: Exprs.const([
          { label: 'Work', value: 11 },
          { label: 'Eat', value: 2 },
          { label: 'Commute', value: 2 },
          { label: 'Watch TV', value: 2 },
          { label: 'Sleep', value: 7 },
        ]),
      }],
      ['br'],
      ['button', {}, {
        click: Exprs.op(ListOps.add, { 
          list: Exprs.get('dynamicList'), 
          item: Exprs.const(1),
        }),
      }, [
        'Add to List',
      ]],
      ['br'],
      createFor(Exprs.get('dynamicList'), [
        Exprs.get('index'),
        ' okay!',
        ['br'],
      ]),
    ]],
      this.$refs.target as HTMLElement,
    );
    */

   
  },
  methods: {
    clonePreview(preview: NodePreview) {
      const node = preview.template === undefined ? preview.preview : preview.template;

      return {
        id: Math.random(),
        node: DataTypes.copy(node),
      };
    },
    setSelection(selection: NodeSelection) {
      this.selection = selection;
    },
    updateSelection(node: NodeTemplateChild) {
      if (this.selection) {
        this.selection.node = node;
        if (this.selection.children && isNumber(this.selection.childIndex)) {
          this.$set(this.selection.children, this.selection.childIndex, node);
        }
      }
    },
    preview(): void {
      this.previewing = true;

      this.$nextTick(() => {
        const target = this.$refs.previewTarget as HTMLElement;

        mount(DataTypes.copy(this.data), ['div', {}, {}, this.root], target.firstElementChild as Element);
      });
    },
    closePreview(): void {
      (this.$refs.previewTarget as HTMLElement).innerHTML = '<div></div>';
      this.previewing = false;
    },
    addComponents(): void {

      addComponent<{
        title: string,
        label: string,
        value: string,
        data: Array<{label: string, value: number, color?: string, offset?: number}>,
      }, { 
        updated: null,
      }>({
        collection: 'googlecharts',
        name: 'pie',
        attributes: {
          title: Types.text(),
          label: Types.text(),
          value: Types.text(),
          data: Types.list(Types.object({ 
            label: Types.text(), 
            value: Types.number(),
            color: Types.optional(Types.color()),
            offset: Types.number(0, 1),
          })),
        },
        events: {
          updated: Types.null(),
        },
        render: () => ['div'],
        created: (i) => {
          i.update();
        },
        updated: (i) => {
          const google = (window as any).google;

          google.charts.setOnLoadCallback(() => {
            const target = i?.node?.elements?.[0];

            if (!target) {
              return;
            }

            const chart = i.cache.chart || new google.visualization.PieChart(target);
            const [data, label, value, title]: [any[], string, string, string] = [
              i.scope.get('data'), 
              i.scope.get('label'), 
              i.scope.get('value'), 
              i.scope.get('title'),
            ];
            
            const chartData = ([[label, value]] as Array<[string, any]>).concat(data.map((p) => [p.label, p.value]));

            const options = {
              title,
              slices: {} as any,
            };

            data.forEach((point, pointIndex) => {
              options.slices[pointIndex] = {
                offset: point.offset,
                color: point.color,
              };
            });

            const chartTable = google.visualization.arrayToDataTable(chartData);

            chart.draw(chartTable, options);

            i.cache.chart = chart;
            i.cache.options = options;

            i.trigger('updated', null);
          });
        },
      });
    },
  },
});
</script>

<style lang="less">
@import '~bulma/css/bulma.css';

.design-left {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  overflow: scroll;
  background-color: rgba(0,0,0,0.1);
  padding: 0.5rem;
}
.design-center {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 200px;
  right: 300px;
  overflow: scroll;
  padding: 1rem 0.5rem;
}
.design-right {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 300px;
  overflow: scroll;
  background-color: rgba(0,0,0,0.1);
  padding: 0.5rem;
}
</style>
<template>
  <div class="pa-3">
    <div ref="target"></div>
  </div> 
</template>

<script lang="ts">
import Vue from 'vue';
import { Exprs, NumberOps } from 'expangine-runtime';
import { mount } from './interface/Component';
import { ListOps } from '../../expangine-runtime/src';


export default Vue.extend({
    data: () => ({

    }),
    computed: {
        
    },
    async mounted() {
        (window as any).google.charts.load('current', {packages:['corechart']});

        (window as any).mounted = mount(
            { times: 1, list: ['a', 'b', 'c'], dynamicList: [] },
            ['div', { style: 'width: 600px' }, {}, [
                ['button', { class: 'x' }, {
                    click: Exprs.update(Exprs.get(), 'page', 'times')
                        .to(Exprs.op(NumberOps.add, { 
                            value: Exprs.get('current'), 
                            addend: Exprs.const(1),
                        })),
                }, [
                    Exprs.template('Clicked {count} times', { count: Exprs.get('page', 'times') }),
                ]],
                ['br'],
                [':if', { 
                    condition: Exprs.op(NumberOps.isDivisible, { value: Exprs.get('page', 'times'), by: 2 }),
                }, {}, [
                    'It is even!',
                ]],
                ['br'],
                [':for', { items: Exprs.get('page', 'list'), key: Exprs.get('index') }, {}, [
                    Exprs.template('{k}: {v} ({count})', {
                        k: Exprs.get('index'),
                        v: Exprs.get('item'),
                        count: Exprs.get('page', 'times'),
                    }),
                    ['br'],
                ]],
                ['googlecharts/pie', {
                    title: Exprs.template('My Daily Activities {count}', { count: Exprs.get('page', 'times') }),
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
                        list: Exprs.get('page', 'dynamicList'), 
                        item: Exprs.const(1) 
                    }),
                }, [
                    'Add to List',
                ]],
                ['br'],
                [':for', { items: Exprs.get('page', 'dynamicList'), key: Exprs.get('index') }, {}, [
                    Exprs.get('index'),
                    ' okay!',
                    ['br'],
                ]],
            ]],
            this.$refs.target as HTMLElement,
        );
    },
    methods: {
        
    },
});
</script>
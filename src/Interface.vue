<template>
  <div class="pa-3">
    
  </div> 
</template>

<script lang="ts">
import Vue from 'vue';
import { Exprs, NumberOps } from 'expangine-runtime';
import { mount } from './interface/Component';


export default Vue.extend({
    data: () => ({

    }),
    computed: {
        
    },
    async mounted() {
        mount(
            { times: 0 }, 
            ['button', { class: 'btn' }, { 
                click: Exprs.update('get', 'times')
                    .to(Exprs.op(NumberOps.add, { 
                        value: Exprs.get('current'), 
                        addend: Exprs.const(1) 
                    })) 
            }, [
                Exprs.template('Clicked {count} times', { count: Exprs.get('times') })
            ]], 
            this.$el
        );
    },
    methods: {
        
    },
});
</script>
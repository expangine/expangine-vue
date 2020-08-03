<template>
  <div class="pa-3">
    <div v-if="loading">
        <v-progress-circular
            indeterminate
            color="primary"
        ></v-progress-circular>
    </div>
    <div v-else-if="invalid">
      The shared project or program do not exist. Sorry for this inconvenience!
    </div>
    <div v-else>
        <h1>
            {{ program.name }}

            <v-btn icon @click="edit">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-menu offset-y v-if="multiplePrograms">
                <template #activator="{ on }">
                    <v-icon v-on="on">mdi-arrow-down</v-icon>
                </template>
                <v-list>
                    <v-list-item-group v-model="currentProgram">
                        <template v-for="program in registry.defs.programs.values">
                            <v-list-item :key="program.name">
                                <v-list-item-content>
                                    <v-list-item-title v-text="program.name"></v-list-item-title>
                                    <v-list-item-subtitle v-text="program.description"></v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-list-item-group>
                </v-list>
            </v-menu>

            <v-chip label small class="float-right">
                Created:&nbsp;<timeago :datetime="program.created"></timeago>
            </v-chip>
            <v-chip label small class="float-right mr-4">
                Updated:&nbsp;<timeago :datetime="program.updated"></timeago>
            </v-chip>

        </h1>
      
        <p class="pa-3">{{ program.description }}</p>

        <v-tabs v-model="tab" dark>
            <v-tabs-slider></v-tabs-slider>

            <v-tab key="Input">
                Input
            </v-tab>

            <template v-for="data in referencedData">
                <v-tab :key="data.name">
                    {{ data.name }}
                </v-tab>
            </template>

            <v-tab key="Output" @click="updateOutput">
                Output
            </v-tab>

            <v-tab-item key="Input">
                <ex-type-input
                    :value="currentData"
                    :type="program.dataType"
                    :registry="registry"
                    :settings="settings"
                ></ex-type-input>
            </v-tab-item>

            <template v-for="data in referencedData">
                <v-tab-item :key="data.name">
                    <ex-type-input
                        :value="data.data"
                        :type="data.dataType"
                        :registry="registry"
                        :settings="getDataSettings(data)"
                    ></ex-type-input>
                </v-tab-item>
            </template>

            <v-tab-item key="Output">

                <ex-data-menu 
                    read-only
                    class="ex-data-menu"
                    :button-props="{ fab: true, dark: true, color: 'primary', xSmall: true, right: true, top: true, absolute: true }"
                    :data="output" 
                    :registry="registry" 
                    :type="outputType"
                ></ex-data-menu>

                <ex-type-input
                    read-only
                    :value="output"
                    :type="outputType"
                    :registry="registry"
                    :settings="outputSettings"
                ></ex-type-input>

            </v-tab-item>

        </v-tabs>
    </div>
  </div> 
</template>

<script lang="ts">
import Vue from 'vue';
import { Program, Traverser, GetDataExpression, Type, ReferenceData } from 'expangine-runtime';
import { sendNotification } from './app/Notify';
import { TypeSettings } from './runtime/types/TypeVisuals';
import { LiveRuntime } from 'expangine-runtime-live';
import { System } from './app/SystemEvents';
import Registry from './runtime';



export default Vue.extend({
    props: {
        projectName: String,
        programName: String,
    },
    data: () => ({
       registry: Registry,
       loading: true, 
       invalid: true,
       program: null as Program | null,
       tab: null,
       dataIndex: 0,
       output: null as any,
       loadings: 0,
    }),
    computed: {
        multiplePrograms(): boolean {
            return this.registry.defs.programs.values.length > 1;
        },
        currentProgram: {
            get(): string {
                return this.program ? this.program.name : '';
            },
            set(name: string) {
                this.program = this.registry.defs.getProgram(name);
            },
        },
        referencedData(): ReferenceData[] {
            if (!this.program) {
                return [];
            }

            const names: Record<string, ReferenceData> = Object.create(null);

            this.program.expression.traverse(new Traverser((expr) => {
                if (expr instanceof GetDataExpression) {
                    const data = this.registry.defs.getData(expr.name);
                    if (data) {
                        names[expr.name] = data;
                    }
                }
            }));

            return Object.values(names);
        },
        settings(): TypeSettings | null {
            if (!this.program) {
                return null;
            }

            if (this.registry.getTypeSettingsValidFor(this.program.dataType, this.program.meta)) {
                return this.program.meta;
            }
            
            return this.program.meta = this.registry.getTypeSettings(this.program.dataType);
        },
        currentData(): any {
            return this.program ? this.program.datasets[this.dataIndex].data : null;
        },
        outputType(): Type {
            return this.registry.defs.describe(this.output);
        },
        outputSettings(): TypeSettings {
            return this.registry.getTypeSettings(this.outputType);
        },
    },
    async mounted() {
        System.off('loading').on('loading', this.handleLoading);

        try {
            const { defs } = Registry;
            const project = await (await fetch(`shares/${this.projectName}`)).json();
            
            defs.sync(project);

            const program = defs.getProgram(this.programName);

            if (program) {
                this.program = program;
                this.invalid = false;
            }
        } catch (e) {
            sendNotification({ message: 'There was an error loading the shared project, please contact The Creator.' });
        }

        this.loading = false;
    },
    methods: {
        updateOutput() 
        {
            if (this.program) {
                this.output = LiveRuntime.run(this.program.expression, this.currentData);
            }
        },
        getDataSettings(data: ReferenceData) 
        {
            return this.registry.getTypeSettings(data.dataType);
        },
        edit() 
        {
            this.$router.push({
                path: '/', query: { share: this.projectName },
            });
        },
        async handleLoading(eventType: 'loading', loadable: () => Promise<any>)
        {
            this.loadable(loadable);
        },
        async loadable<R = any>(callback: () => R | Promise<R>): Promise<R | undefined>
        {
            let result: R | undefined;
            this.loadings++;

            try
            {
                await this.$nextTick();

                result = await callback();
            }
            catch (e)
            {
                sendNotification({ message : 'There was an unexpected error: ' + e });

                window.console.log('error in loadable', e);
            }

            this.loadings--;

            return result;
        },
    },
});
</script>
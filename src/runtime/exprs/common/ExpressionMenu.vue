<template>
  <span class="d-inline-block">
    
    <ex-chip-menu :text="text" :tooltip="statusTooltip" :color="statusColor" :dark="statusDark">
      <v-list subheader class="py-0">
        <ex-child-filter @keydown.native="menuRight">

          <v-subheader>Info</v-subheader>

          <v-list-item v-if="hasTypeInformation" @click="showTypeInformation = true">
            <v-list-item-content>
              <v-list-item-title>
                Type Information
              </v-list-item-title>
              <v-list-item-subtitle>
                The expression's expected and actual type
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <slot name="prepend"></slot>

          <ex-expression-clipboard :registry="registry">
            <template #default="{ copy }">
              <v-list-item @click="copy(value)" v-if="canCopy">
                <v-list-item-content>
                  <v-list-item-title>
                    Copy {{ visuals.name }}
                    <ex-shortcut-label pref="expression_copy"></ex-shortcut-label>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Add this expression to the clipboard
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="cutExpression" v-if="canCopy">
                <v-list-item-content>
                  <v-list-item-title>
                    Cut {{ visuals.name }}
                    <ex-shortcut-label pref="expression_cut"></ex-shortcut-label>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Remove expression and add to the clipboard
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="copy(value.parent)" v-if="canCopyChain">
                <v-list-item-content>
                  <v-list-item-title>
                    Copy Expression Chain
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Add the expression list to the clipboard
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </ex-expression-clipboard>

          <v-list-item @click="getAll" v-if="data">
            <v-list-item-content>
              <v-list-item-title>
                Run Program Here
              </v-list-item-title>
              <v-list-item-subtitle>
                Calculates all results of this expression with the current data
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="edit" v-if="!readOnly">
            <v-list-item-content>
              <v-list-item-title>
                Edit
              </v-list-item-title>
              <v-list-item-subtitle>
                Edit this expression in a dialog
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <template v-if="canTransform">

            <v-divider></v-divider>
            <v-subheader>Transform</v-subheader>

            <template v-for="expr in modifiers">
              <v-list-item :key="expr.text" @click="modify(expr.value)">
                <v-list-item-content>
                  <v-list-item-title>{{ expr.text }}</v-list-item-title>
                  <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>

          </template>

          <template v-if="canChange">

            <v-divider></v-divider>
            <v-subheader>Change</v-subheader>

            <v-list-item @click="createFunction">
              <v-list-item-content>
                <v-list-item-title>
                  Create Function
                </v-list-item-title>
                <v-list-item-subtitle>
                  Create a new function that returns this {{ visuals.name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="isRemovable" @click="requestRemove">
              <v-list-item-content class="red--text darken-4">
                <v-list-item-title>
                  Remove {{ visuals.name }}
                  <ex-shortcut-label pref="expression_remove"></ex-shortcut-label>
                </v-list-item-title>
                <v-list-item-subtitle>
                  The entire expression will be removed
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-menu max-height="400" offset-x open-on-hover class="d-inline">
              <template #activator="{ on }">
                <v-list-item v-on="on" ref="replace">
                  <v-list-item-content class="red--text darken-4">
                    <v-list-item-title>
                      Replace with...
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      The entire expression will be replaced with a new one
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-avatar>
                    <v-icon>mdi-menu-right</v-icon>
                  </v-list-item-avatar>
                </v-list-item>
              </template>
              <v-list class="pt-0">
                <ex-child-filter>
                  <template v-for="expr in starters">
                    <v-list-item :key="expr.expr.id" @click="changeTo(expr)">
                      <v-list-item-content>
                        <v-list-item-title>{{ expr.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </ex-child-filter>
              </v-list>
            </v-menu>

            <ex-expression-clipboard 
              :registry="registry" 
              :context="context" 
              :required-type="requiredType" 
              @pasted="input">
              <template #default="{ copiedOptions, paste }">
                <v-menu v-if="copiedOptions.length" max-height="400" offset-x open-on-hover class="d-inline">
                  <template #activator="{ on }">
                    <v-list-item v-on="on" ref="paste">
                      <v-list-item-content class="red--text darken-4">
                        <v-list-item-title>
                          Paste...
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          The entire expression will be replaced with one from the clipboard
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-avatar>
                        <v-icon>mdi-menu-right</v-icon>
                      </v-list-item-avatar>
                    </v-list-item>
                  </template>
                  <v-list class="pt-0">
                    <ex-child-filter>
                      <template v-for="(expr, index) in copiedOptions">
                        <v-list-item :key="index" @click="paste(expr.value)">
                          <v-list-item-content>
                            <v-list-item-title>{{ expr.text }}</v-list-item-title>
                            <v-list-item-subtitle>{{ expr.description }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </ex-child-filter>
                  </v-list>
                </v-menu>
              </template>
            </ex-expression-clipboard>

          </template>
          
          <slot name="append"></slot>

        </ex-child-filter>

      </v-list>

    </ex-chip-menu>

    <v-dialog v-model="showTypeInformation" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ text }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-if="requiredType">
                <h4>Expected Type</h4>
                <ex-type-string-box
                  :type="requiredType"
                  :registry="registry"
                ></ex-type-string-box>
              </v-col>
              <v-col v-if="computedType">
                <h4>Actual Type</h4>
                <ex-type-string-box
                  :type="computedType"
                  :registry="registry"
                ></ex-type-string-box>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, AnyType, isFunction, TypeMap, Traverser, SetExpression, UpdateExpression, GetExpression, ConstantExpression, ObjectType, ReturnExpression, ChainExpression, Exprs, objectMap, Types, CommandProvider, copy, Func } from 'expangine-runtime';
import { LiveContext, LiveResult, LiveRuntime } from 'expangine-runtime-live';
import { ListOptions } from '../../../common';
import { ExpressionVisuals, ExpressionModifierCallback } from '../ExpressionVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { sendNotification } from '../../../app/Notify';
import { getEditFunction } from '../../../app/EditFunction';
import { getDisplayData } from '../../../app/DisplayData';
import { getProgram } from '../../../app/GetProgram';
import ExpressionBase from '../ExpressionBase';
import { Preferences, PreferenceCategory } from '../../../app/Preference';


const PREF_EXPRESSION_CHANGE = Preferences.define({
  key: 'expression_change',
  label: 'Change expressions without confirmation',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_EXPRESSION_MODIFY = Preferences.define({
  key: 'expression_modify',
  label: 'Modify expressions without confirmation',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default ExpressionBase().extend({
  name: 'ex-expression-menu',
  props: {
    text: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
    invalidOverride: {
      type: Boolean,
      default: null,
    },
  },
  data: () => ({
    showTypeInformation: false,
  }),
  computed: {
    isInvalid(): boolean {
      return this.invalidOverride !== null ? this.invalidOverride : this.invalid;
    },
    hasTypeInformation(): boolean {
      return !!(this.requiredType && !(this.requiredType instanceof AnyType))
          || !!(this.computedType && !(this.computedType instanceof AnyType));
    },
    canTransform(): boolean {
      return !this.readOnly;
    },
    canChange(): boolean {
      return !this.readOnly;
    },
    statusColor(): string {
      return this.isInvalid ? this.displayOptions.error : this.displayOptions.color;
    },
    statusDark(): boolean {
      return this.isInvalid;
    },
    statusTooltip(): string {
      if (!this.isInvalid || !this.requiredType || !this.computedType) {
        return this.tooltip;
      }
      const actual = this.registry.getTypeDescribe(this.computedType);
      const expected = this.registry.getTypeDescribe(this.requiredType);

      return `Expected ${expected} but given ${actual}`;
    },
    starters(): ExpressionVisuals[] {
      return this.registry.getExpressionsStart(this.requiredType);
    },
    modifiers(): ListOptions<ExpressionModifierCallback> {
      return this.registry.getExpressionsModifiers(this.requiredType, this.value, this.computedType);
    },
    canCopy(): boolean {
      return this.registry.isValidExpressionCopy(this.value);
    },
    canCopyChain(): boolean {
      return this.value.parent instanceof ChainExpression
        && this.registry.isValidExpressionCopy(this.value.parent);
    },
  },
  methods: {
    async createFunction() {
      const { value, context, registry } = this;

      if (!(context instanceof ObjectType)) {
        await sendNotification({
          message: 'The context to an expression must be an object to create a function here.',
        });

        return false;
      }

      const input: TypeMap = {};
      let setTopLevel = false;

      value.traverse(new Traverser((expr) => {
        if (expr instanceof SetExpression || expr instanceof UpdateExpression) {
          if (expr.path.length === 1) {
            const first = expr.path[0];
            if (first instanceof ConstantExpression && first.value in context.options.props) {
              setTopLevel = true;
            }
          }
        }
        if (expr instanceof SetExpression || expr instanceof UpdateExpression || expr instanceof GetExpression) {
          const first = expr.path[0];
          if (first instanceof ConstantExpression && first.value in context.options.props) {
            input[first.value] = context.options.props[first.value];
          }
        }
      }));

      if (setTopLevel) {
        await sendNotification({
          message: 'You cannot create a function where a sub-expression directly sets a variable in the current context.',
        });

        return false;
      }

      const result = await getEditFunction({
        registry,
        func: Func.create(registry.defs, {
          params: Types.object(input),
          expression: Exprs.return(value),
        }),
      });

      if (result) {
        const args = objectMap(input, (_, name) => Exprs.get(name));

        this.input(Exprs.invoke(result.name, args));
      }
    },
    async changeTo(visuals: ExpressionVisuals) {
      if (await getConfirmation({ pref: PREF_EXPRESSION_CHANGE })) {
        this.input(visuals.create(this.requiredType, this.context, this.registry));
      }
    },
    async modify(value: ExpressionModifierCallback) {
      const options = isFunction(value)
        ? undefined
        : value.options;
      const callback = isFunction(value)
        ? value
        : value.handler;

      if (await getConfirmation({ ...options, pref: PREF_EXPRESSION_MODIFY })) {
        const result = callback();
        if (result) {
          this.input(result);
        }
      }
    },
    async edit() {
      const { registry, context, value: program, requiredType: expectedType } = this;

      const result = await getProgram({
        title: 'Edit Expression',
        registry,
        context,
        program,
        expectedType,
        programLabel: 'Expression',
        confirm: 'Replace',
      });

      if (!result)
      {
        return await sendNotification({ message: 'Edit Expression canceled.' });
      }

      this.input(result.program);
    },
    async getAll() {
      const registry = this.registry;
      const data = copy(this.data);
      const results: Map<string, [any, number]> = new Map();
      const resultType = this.computedTypeRaw;
      const capture: Expression = this.value;
      let root: Expression = capture;

      if (!resultType || data === null) {
        return;
      }

      while (root.parent) {
        root = root.parent;
      }

      const interceptProvider: CommandProvider<LiveContext, LiveResult> = 
      {
        returnProperty: LiveRuntime.returnProperty,
        getFunction: (name) => LiveRuntime.getFunction(name),
        getOperation: (id) => LiveRuntime.getOperation(id),
        getComputed: (id) => LiveRuntime.getComputed(id),
        getOperationScopeDefaults: (id) => LiveRuntime.getOperationScopeDefaults(id),
        getCommand(expr: Expression) 
        {
          const run = LiveRuntime.getCommand(expr, interceptProvider);

          if (expr === capture)
          {
            return (context: LiveContext) => 
            {
              const result = run(context);
              const resultJson = resultType.toJson(result);
              const resultCopy = resultType.fromJson(resultJson);
              const resultKey = JSON.stringify(resultJson);
              const resultPair = results.get(resultKey);

              if (!resultPair)
              {
                results.set(resultKey, [resultCopy, 1]);
              }
              else
              {
                resultPair[1]++;
              }

              return result;
            };
          }

          return run;
        },
      };

      const command = interceptProvider.getCommand(root);

      try 
      {
        command(data);

        getDisplayData({
          registry,
          data: Array.from(results.values()).map(([result, times]) => ({
            result,
            times,
          })),
        });
      } 
      catch (e) 
      {
        window.console.log('error in getAll', e);
      }
    },
    menuRight(ev: KeyboardEvent) {
      if (ev.keyCode === 39) {
        for (const refName in this.$refs) {
          const ref = this.$refs[refName] as any;

          if (ref && 
            ref.$parent && 
            ref.$parent.mouseEnterHandler &&
            ref.$el.classList.contains('v-list-item--highlighted')) {
            ref.$parent.mouseEnterHandler();
          }
        }
      }
    },
  },
});
</script>
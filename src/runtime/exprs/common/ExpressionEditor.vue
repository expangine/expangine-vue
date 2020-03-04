<template>
  <div class="ex-expression-editor" :class="classes">
    <v-toolbar flat dense color="grey lighten-3" v-sticky.x.y="stickyTarget">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon :small="internalCompact" @click="toggleVertical" v-on="on">
            <v-icon>{{ verticalIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ verticalText }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-if="sticky" icon :small="internalCompact" @click="toggleSticky" v-on="on">
            <v-icon>{{ stickyIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ stickyText }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon :small="internalCompact" :disabled="isReadOnlyDisabled" @click="toggleReadOnly" v-on="on">
            <v-icon>{{ readonlyIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ readonlyText }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon :small="internalCompact" v-if="!hideComplexity" :disabled="isShowComplexityDisabled" @click="toggleShowComplexity" v-on="on">
            <v-icon>mdi-speedometer</v-icon>
          </v-btn>
        </template>
        <span>{{ complexityText }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon :small="internalCompact" v-if="!hideReturns" @click="toggleShowReturns" v-on="on">
            <v-icon>mdi-calculator</v-icon>
          </v-btn>
        </template>
        <span>{{ returnsText }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon :small="internalCompact" @click="toggleCompact" v-on="on">
            <v-icon>{{ compactIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ compactText }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-if="!hideHistory" icon :small="internalCompact" :disabled="isUndoDisabled" @click="undo" v-on="on">
            <v-icon>mdi-undo</v-icon>
          </v-btn>
        </template>
        <span>Undo</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-if="!hideHistory" icon :small="internalCompact" :disabled="isRedoDisabled" @click="redo" v-on="on">
            <v-icon>mdi-redo</v-icon>
          </v-btn>
        </template>
        <span>Redo</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="tooltip">
          <v-menu fixed :close-on-content-click="false" max-height="400">
            <template #activator="menu">
              <v-btn v-if="isValidating" icon :small="internalCompact" v-on="{ ...tooltip.on, ...menu.on }">
                <v-badge
                  overlap="overlap"
                  class="align-self-center"
                  :color="validationColor"
                  :value="validations.length > 0"
                >
                  <template v-slot:badge>
                    <span>{{ validations.length }}</span>
                  </template>
                  <v-icon>{{ validationIcon }}</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-select
                  outlined
                  hide-details
                  label="Minimum Severity"
                  :items="validationOptions"
                  v-model="validationSeverity"
                  @change="updatedSeverity"
                ></v-select>

                <template v-for="(validation, index) in validations">
                  <ex-validation
                    :key="index"
                    :validation="validation"
                    :registry="registry"
                    @hover="setHighlightValidation"
                  ></ex-validation>
                </template>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
        <span>{{ validations.length }} Problems</span>
      </v-tooltip>
      <v-menu offset-y :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn icon :small="internalCompact" :disabled="readOnly" v-on="on">
            <v-icon>mdi-palette-outline</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item>
            <v-list-item-icon class="pt-4 mr-2 my-0">
              <v-icon :color="internalColor">mdi-checkbox-blank-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-autocomplete
                dense
                outlined
                hide-details
                label="Color"
                :items="colorOptions"
                v-model="internalColor"
                @input="updateColor"
              ></v-autocomplete>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon class="pt-4 mr-2 my-0">
              <v-icon :color="internalError">mdi-close-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-autocomplete
                dense
                outlined
                hide-details
                label="Error Color"
                :items="colorOptions"
                v-model="internalError"
                @input="updateError"
              ></v-autocomplete>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon class="pt-4 mr-2 my-0">
              <v-icon :color="showReturnColor">mdi-alert-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-autocomplete
                dense
                outlined
                hide-details
                label="Return Color"
                :items="colorOptions"
                v-model="showReturnColor"
                @input="updateReturnColor"
              ></v-autocomplete>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-if="canRun" icon :small="internalCompact" @click="run" v-on="on">
            <v-icon>mdi-play</v-icon>
          </v-btn>
        </template>
        <span>Run Program</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-if="canRun" icon :small="internalCompact" @click="debug" v-on="on">
            <v-icon>mdi-bug</v-icon>
          </v-btn>
        </template>
        <span>Debug</span>
      </v-tooltip>
    </v-toolbar>
    <ex-expression
      v-bind="$props"
      class="ma-2"
      :read-only="isReadOnly"
      :show-complexity="isShowComplexity"
      :display-options="getDisplayOptions"
      :highlight="highlightedExpressions"
      @input="onChange"
      @remove="onRemove"
    ></ex-expression>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, Types, ReturnExpression, Validation, ValidationSeverity, Traverser, DataTypes, Program } from 'expangine-runtime';
import { ListOptions, isMapEqual } from '@/common';
import { getRunProgram } from '@/app/RunProgram';
import { getDebugProgram } from '@/app/DebugProgram';
import { ValidationHelper } from '@/app/ValidationHelper';
import { Preferences, PreferenceCategory } from '@/app/Preference';
import { ColorsType, Colors } from '@/app/Colors';
import ExpressionBase, { ExpressionDisplayOptions } from '../ExpressionBase';


const PREF_COMPACT = Preferences.define({
  key: 'expression_editor_compact',
  label: 'Expression editor compact view',
  category: [PreferenceCategory.EXPRESSION_EDITOR],
  defaultValue: false,
});

const PREF_ORIENTATION = Preferences.define({
  key: 'expression_editor_orientation',
  label: 'Expression editor vertical toolbar orientation',
  category: [PreferenceCategory.EXPRESSION_EDITOR],
  defaultValue: null as null | boolean,
  type: Types.bool(),
});

const PREF_VALIDATION_SEVERITY = Preferences.define({
  key: 'expression_editor_severity',
  label: 'Expression editor minimum validation severity',
  category: [PreferenceCategory.EXPRESSION_EDITOR],
  defaultValue: ValidationSeverity.MEDIUM,
  type: Types.enum(
    Types.number(),
    Types.text(),
    [
      ['Low', ValidationSeverity.LOW],
      ['Medium', ValidationSeverity.MEDIUM],
      ['High', ValidationSeverity.HIGH],
    ],
  ),
});

const PREF_COLOR = Preferences.define({
  key: 'expression_editor_color',
  label: 'Expression editor theme color',
  category: [PreferenceCategory.EXPRESSION_EDITOR],
  defaultValue: 'primary',
  type: ColorsType,
});

const PREF_ERROR = Preferences.define({
  key: 'expression_editor_error',
  label: 'Expression editor error color',
  category: [PreferenceCategory.EXPRESSION_EDITOR],
  defaultValue: 'error',
  type: ColorsType,
});

const PREF_RETURN_COLOR = Preferences.define({
  key: 'expression_editor_return_color',
  label: 'Expression editor return expressions color',
  category: [PreferenceCategory.EXPRESSION_EDITOR],
  defaultValue: '#e1bee7',
  type: ColorsType,
});


export default ExpressionBase().extend({
  name: 'ex-expression-editor',
  props: {
    hideHistory: {
      type: Boolean,
      default: false,
    },
    hideRun: {
      type: Boolean,
      default: false,
    },
    hideTest: {
      type: Boolean,
      default: false,
    },
    hideColors: {
      type: Boolean,
      default: false,
    },
    hideValidation: {
      type: Boolean,
      default: false,
    },
    hideComplexity: {
      type: Boolean,
      default: false,
    },
    hideReturns: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    sticky: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    internalReadOnly: false,
    internalShowComplexity: false,
    internalCompact: Preferences.get(PREF_COMPACT),
    internalColor: Preferences.get(PREF_COLOR),
    internalError: Preferences.get(PREF_ERROR),
    internalVertical: Preferences.get(PREF_ORIENTATION),
    internalHighlights: new Map(),
    undos: [] as any[],
    redos: [] as any[],
    triggering: false,
    topOffset: 0,
    validations: [] as Validation[],
    validationSeverity: Preferences.get(PREF_VALIDATION_SEVERITY),
    validationHighlight: null as null | Validation,
    validationSubjectColor: '#E57373',
    validationParentColor: '#FFCDD2',
    showReturnColor: Preferences.get(PREF_RETURN_COLOR),
    showReturns: false,
    highlightedExpressions: new Map<Expression, string>(),
    stickyEnabled: true,
  }),
  computed: {
    colorOptions(): ListOptions<string> {
      return Colors.map(([text, value]) => ({ text, value }));
    },
    isVertical(): boolean {
      return this.internalVertical !== null
        ? this.internalVertical 
        : this.vertical;
    },
    isReadOnlyDisabled(): boolean {
      return this.readOnly;
    },
    isReadOnly(): boolean {
      return this.readOnly || this.internalReadOnly;
    },
    isShowComplexityDisabled(): boolean {
      return this.showComplexity;
    },
    isShowComplexity(): boolean {
      return this.showComplexity || this.internalShowComplexity;
    },
    readonlyIcon(): string {
      return this.internalReadOnly ? 'mdi-pencil' : 'mdi-pencil-off';
    },
    readonlyText(): string {
      return this.internalReadOnly ? 'Edit' : 'Read-Only View';
    },
    compactIcon(): string {
      return this.internalCompact ? 'mdi-arrow-expand-all' : 'mdi-arrow-collapse-all';
    },
    compactText(): string {
      return this.internalCompact ? 'Expanded View' : 'Dense View';
    },
    verticalIcon(): string {
      return this.isVertical ? 'mdi-arrow-right' : 'mdi-arrow-down';
    },
    verticalText(): string {
      return this.isVertical ? 'Switch to Horizontal' : 'Switch to Vertical';
    },
    complexityText(): string {
      return this.internalShowComplexity ? 'Hide Complexity' : 'Show Complexity';
    },
    returnsText(): string {
      return this.showReturns ? 'Hide Highlights for Return Expressions' : 'Show Highlights for Return Expressions';
    },
    stickyIcon(): string {
      return this.vertical
        ? 'mdi-arrow-up-down'
        : 'mdi-arrow-left-right';
    },
    stickyText(): string {
      return this.stickyEnabled ? 'Disable Auto Scrolling' : 'Enable Auto Scrolling';
    },
    getDisplayOptions(): ExpressionDisplayOptions {
      return {
        compact: this.internalCompact,
        color: this.internalColor,
        error: this.internalError,
      };
    },
    isUndoDisabled(): boolean {
      return this.isReadOnly || this.undos.length <= 1;
    },
    isRedoDisabled(): boolean {
      return this.isReadOnly || this.redos.length === 0;
    },
    canRun(): boolean {
      return !!this.data && !this.hideRun;
    },
    canTest(): boolean {
      return !!this.data && !this.hideTest;
    },
    isValidating(): boolean {
      return !this.hideValidation;
    },
    validationMaxSeverity(): ValidationSeverity {
      return this.validations.reduce((max, validation) => Math.max(max, validation.severity), ValidationSeverity.LOW);
    },
    validationIcon(): string {
      return ValidationHelper.ICONS[this.validationMaxSeverity];
    },
    validationColor(): string {
      return ValidationHelper.COLORS_BACKGROUND[this.validationMaxSeverity];
    },
    validationOptions(): ListOptions<ValidationSeverity> {
      return [
        { text: 'Low', value: ValidationSeverity.LOW },
        { text: 'Medium', value: ValidationSeverity.MEDIUM },
        { text: 'High', value: ValidationSeverity.HIGH },
      ];
    },
    stickyTarget(): string | false {
      return this.sticky && this.stickyEnabled ? '.v-toolbar__content' : false;
    },
    classes(): any {
      return {
        vertical: this.isVertical,
      };
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value: Expression) {
        this.handleChange(value);
      },
    },
  },
  mounted() {
    this.updateTopOffset();
  },
  methods: {
    toggleReadOnly() {
      this.internalReadOnly = !this.internalReadOnly;
    },
    toggleShowComplexity() {
      this.internalShowComplexity = !this.internalShowComplexity;
    },
    toggleCompact() {
      this.internalCompact = !this.internalCompact;

      Preferences.set(PREF_COMPACT, this.internalCompact);
    },
    toggleVertical() {
      this.internalVertical = !this.isVertical;

      Preferences.set(PREF_ORIENTATION, this.internalVertical);
    },
    toggleShowReturns() {
      this.showReturns = !this.showReturns;
      this.updateHighlightExpressions();
    },
    toggleSticky() {
      this.stickyEnabled = !this.stickyEnabled;
    },
    updatedSeverity() {
      Preferences.set(PREF_VALIDATION_SEVERITY, this.validationSeverity);

      this.validate();
    },
    validate() {
      if (!this.hideValidation) {
        this.validations = this.value
          .validations(this.registry.defs, this.context)
          .filter((validation) => validation.severity >= this.validationSeverity)
        ;
      }

      this.updateHighlightExpressions();
    },
    setHighlightValidation(validation: Validation | null) {
      this.validationHighlight = validation;
      this.updateHighlightExpressions();
    },
    updateHighlightExpressions() {
      const highlights = new Map();

      if (this.showReturns) 
      {
        const returns = this.value.traverse(Traverser.list<Expression>().filterClass(ReturnExpression));
        returns.forEach((expr) => {
          this.registry.getExpressionReturns(expr.value).forEach((highlight) => {
            highlights.set(highlight, this.showReturnColor);
          });
        });

        this.registry.getExpressionReturns(this.value).forEach((highlight) => {
          highlights.set(highlight, this.showReturnColor);
        });
      }

      if (this.validationHighlight)
      {
        highlights.set(this.validationHighlight.subject, this.validationSubjectColor);

        if (this.validationHighlight.parent)
        {
          highlights.set(this.validationHighlight.parent, this.validationParentColor);
        }
      }

      if (this.highlight && this.highlight.size > 0)
      {
        this.highlight.forEach((value, key) => highlights.set(key, value));
      }

      if (!isMapEqual(highlights, this.highlightedExpressions))
      {
        this.highlightedExpressions = highlights;
      }
    },
    updateTopOffset() {
      const rect = this.$el.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      this.topOffset = rect.top + scrollTop;
    },
    updateColor() {
      Preferences.set(PREF_COLOR, this.internalColor);
    },
    updateError() {
      Preferences.set(PREF_ERROR, this.internalError);
    },
    updateReturnColor() {
      Preferences.set(PREF_RETURN_COLOR, this.showReturnColor);
    },
    undo() {
      const undo = this.undos.pop();
      
      if (undo) {
        this.redos.push(undo);
        this.apply();
      }
    },
    redo() {
      const redo = this.redos.pop();
      
      if (redo) {
        this.undos.push(redo);
        this.apply();
      }
    },
    apply() {
      const expr = this.undos[this.undos.length - 1];
      if (expr) {
        this.handleInput(this.registry.defs.getExpression(expr));
      }
    },
    handleChange(expr?: Expression) {
      if (!this.hideHistory && !this.triggering) {
        this.redos = [];

        if (expr) {
          this.undos.push(expr.encode());
        }
      }
      this.validate();
    },
    handleInput(expr: Expression) {
      this.triggering = true;
      this.input(expr);
      this.triggering = false;
    },
    handleRemove() {
      this.triggering = true;
      this.remove();
      this.triggering = false;
    },
    onChange(expr: Expression) {
      this.handleChange(expr);
      this.handleInput(expr);
    },
    onRemove(expr: Expression) {
      this.handleChange(expr);
      this.handleRemove();
    },
    run() {
      const { registry, data, context: dataType, value: expression } = this;

      getRunProgram({
        registry,
        program: Program.create(this.registry.defs, {
          dataType,
          expression,
          datasets: [{ 
            name: '',
            data,
            created: 0,
            updated: 0,
            meta: null,
          }],
        }),
      });
    },
    debug() {
      const { registry, data, context: type, value: program } = this;

      getDebugProgram({
        registry,
        type,
        data,
        program,
      });
    },
  },
});
</script>

<style lang="less" scoped>
.ex-expression-editor {

  &.vertical {
    display: flex;
    
    /deep/ .v-toolbar {
      width: 48px;
      height: auto !important;
      flex: 0 0 48px;

      .v-toolbar__content {
        width: 48px;
        height: auto !important;
        padding: 16px 0 !important;
        flex-direction: column;

        & > .v-btn.v-btn--icon:first-child {
          margin-left: 0px;
          margin-top: -12px;
        }

        & > .v-btn.v-btn--icon:last-child {
          margin-right: 0px;
          margin-bottom: -12px;
        }
      }
    }    
  }
}
</style>

import './app.less';

import { VueConstructor } from 'vue';

import Draggable from 'vuedraggable';
import TypeEditor from './runtime/types/TypeEditor.vue';
import TypeEditorMenu from './runtime/types/TypeEditorMenu.vue';
import TypeInput from './runtime/types/TypeInput.vue';
import TypeHookList from './runtime/types/TypeHookList.vue';
import Expression from './runtime/exprs/Expression.vue';
import PathEditor from './runtime/exprs/common/PathEditor.vue';
import PathViewer from './runtime/exprs/common/PathViewer.vue';
import ExpressionMenu from './runtime/exprs/common/ExpressionMenu.vue';
import ExpressionClipboard from './runtime/exprs/ExpressionClipboard.vue';
import DataString from './app/DataString.vue';
import ChipMenu from './app/ChipMenu.vue';
import ColorPicker from './app/ColorPicker.vue';
import DatePicker from './app/DatePicker.vue';
import SimpleFields from './app/SimpleFields.vue';
import Templated from './app/Templated.vue';
import BuildTypeDialog from './app/BuildTypeDialog.vue';
import ConfirmDialog from './app/ConfirmDialog.vue';
import DebugProgramDialog from './app/DebugProgramDialog.vue';
import DescribeDataDialog from './app/DescribeDataDialog.vue';
import EditFunctionDialog from './app/EditFunctionDialog.vue';
import InputDialog from './app/InputDialog.vue';
import NotifyDialog from './app/NotifyDialog.vue';
import RunProgramDialog from './app/RunProgramDialog.vue';


export * from './app/BuildType';
export * from './app/Confirm';
export * from './app/DebugProgram';
export * from './app/DescribeData';
export * from './app/EditFunction';
export * from './app/Icons';
export * from './app/Input';
export * from './app/Notify';
export * from './app/Promiser';
export * from './app/RunProgram';

export { default as registry } from './runtime';
export * from './runtime/Registry';

export * from './runtime/exprs/ExpressionVisuals';
export { default as ExpressionVisualsImporter } from './runtime/exprs/_import';
export { default as ExpressionBase } from './runtime/exprs/ExpressionBase';

export { default as HookImporter } from './runtime/hooks/_import';
export * from './runtime/hooks/ChangeTypeModifier';
export * from './runtime/hooks/ClipboardHooks';
export * from './runtime/hooks/DefaultWrapper';

export * from './runtime/ops/OperationVisuals';
export { default as OperationVisualsImporter } from './runtime/ops/_import';
export { default as AnyOpsVisuals } from './runtime/ops/AnyOpsVisuals';
export { default as BooleanOpsVisuals } from './runtime/ops/BooleanOpsVisuals';
export { default as ColoOpsVisuals } from './runtime/ops/ColorOpsVisuals';
export { default as DateOpsVisuals } from './runtime/ops/DateOpsVisuals';
export { default as ListOpsVisuals } from './runtime/ops/ListOpsVisuals';
export { default as MapOpsVisuals } from './runtime/ops/MapOpsVisuals';
export { default as NumberOpsVisuals } from './runtime/ops/NumberOpsVisuals';
export { default as ObjectOpsVisuals } from './runtime/ops/ObjectOpsVisuals';
export { default as TextOpsVisuals } from './runtime/ops/TextOpsVisuals';
export { default as TupleOpsVisuals } from './runtime/ops/TupleOpsVisuals';

export * from './runtime/types/TypeVisuals';
export { default as TupleVisualsImporter } from './runtime/types/_import';
export * from './runtime/types/TypeBuilder';
export { default as TypeEditorBase } from './runtime/types/TypeEditorBase';
export * from './runtime/types/TypeHook';
export { default as TypeInputBase } from './runtime/types/TypeInputBase';
export * from './runtime/types/TypeModifier';
export { default as TypeSettingsBase } from './runtime/types/TypeSettingsBase';


export default {
  install: (Vue: VueConstructor, options: any) => {
    Vue.component('ex-type-editor', TypeEditor);
    Vue.component('ex-type-editor-menu', TypeEditorMenu);
    Vue.component('ex-type-input', TypeInput);
    Vue.component('ex-type-hook-list', TypeHookList);
    Vue.component('ex-expression', Expression);
    Vue.component('ex-path-editor', PathEditor);
    Vue.component('ex-path-viewer', PathViewer);
    Vue.component('ex-expression-menu', ExpressionMenu);
    Vue.component('ex-expression-clipboard', ExpressionClipboard);
    Vue.component('ex-chip-menu', ChipMenu);

    Vue.component('ex-build-type-dialog', BuildTypeDialog);
    Vue.component('ex-confirm-dialog', ConfirmDialog);
    Vue.component('ex-debug-program-dialog', DebugProgramDialog);
    Vue.component('ex-describe-data-dialog', DescribeDataDialog);
    Vue.component('ex-edit-function-dialog', EditFunctionDialog);
    Vue.component('ex-input-dialog', InputDialog);
    Vue.component('ex-notify-dialog', NotifyDialog);
    Vue.component('ex-run-program-dialog', RunProgramDialog);

    Vue.component('ex-data-string', DataString);
    Vue.component('ex-color-picker', ColorPicker);
    Vue.component('ex-date-picker', DatePicker);
    Vue.component('ex-simple-fields', SimpleFields);
    Vue.component('ex-draggable', Draggable);
    Vue.component('ex-templated', Templated);
  },
};

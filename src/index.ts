
import './app.less';

import { VueConstructor } from 'vue';
import { ClickOutside } from 'vuetify/lib/directives/click-outside';
import Draggable from 'vuedraggable';
import VueTimeago from 'vue-timeago';
import VueMarkdown from 'vue-markdown';
import wysiwyg from 'vue-wysiwyg';

import TypeEditor from './runtime/types/TypeEditor.vue';
import TypeEditorMenu from './runtime/types/TypeEditorMenu.vue';
import TypeInput from './runtime/types/TypeInput.vue';
import TypeHookList from './runtime/types/TypeHookList.vue';
import Expression from './runtime/exprs/Expression.vue';
import PathEditor from './runtime/exprs/common/PathEditor.vue';
import PathViewer from './runtime/exprs/common/PathViewer.vue';
import ExpressionMenu from './runtime/exprs/common/ExpressionMenu.vue';
import ExpressionEditor from './runtime/exprs/common/ExpressionEditor.vue';
import ExpressionClipboard from './runtime/exprs/ExpressionClipboard.vue';

import ExplorerFile from './app/explorer/ExplorerFile.vue';
import ExplorerFolder from './app/explorer/ExplorerFolder.vue';
import ExplorerProgram from './app/explorer/ExplorerProgram.vue';
import ExplorerProgramFolder from './app/explorer/ExplorerProgramFolder.vue';
import ExplorerData from './app/explorer/ExplorerData.vue';
import ExplorerDataFolder from './app/explorer/ExplorerDataFolder.vue';
import ExplorerFunction from './app/explorer/ExplorerFunction.vue';
import ExplorerFunctionFolder from './app/explorer/ExplorerFunctionFolder.vue';
import ExplorerEntity from './app/explorer/ExplorerEntity.vue';
import ExplorerEntityFolder from './app/explorer/ExplorerEntityFolder.vue';
import ExplorerRelation from './app/explorer/ExplorerRelation.vue';
import ExplorerRelationFolder from './app/explorer/ExplorerRelationFolder.vue';

import ShortcutInput from './app/ShortcutInput.vue';
import ShortcutLabel from './app/ShortcutLabel.vue';
import DataString from './app/DataString.vue';
import DataStringBox from './app/DataStringBox.vue';
import TypeStringBox from './app/TypeStringBox.vue';
import DataMenu from './app/DataMenu.vue';
import ChipMenu from './app/ChipMenu.vue';
import ColorPicker from './app/ColorPicker.vue';
import DatePicker from './app/DatePicker.vue';
import SimpleFields from './app/SimpleFields.vue';
import Templated from './app/Templated.vue';
import BuildType from './app/BuildTypeView.vue';
import BuildTypeDialog from './app/BuildTypeDialog.vue';
import ConfirmDialog from './app/ConfirmDialog.vue';
import DebugProgram from './app/DebugProgramView.vue';
import DebugProgramDialog from './app/DebugProgramDialog.vue';
import DescribeData from './app/DescribeDataView.vue';
import DescribeDataDialog from './app/DescribeDataDialog.vue';
import DisplayData from './app/DisplayDataView.vue';
import DisplayDataDialog from './app/DisplayDataDialog.vue';
import EditFunction from './app/EditFunctionView.vue';
import EditFunctionDialog from './app/EditFunctionDialog.vue';
import EditData from './app/EditDataView.vue';
import EditEntity from './app/EditEntityView.vue';
import EditEntityDialog from './app/EditEntityDialog.vue';
import EditEntityIndex from './app/EditEntityIndexView.vue';
import EditEntityIndexDialog from './app/EditEntityIndexDialog.vue';
import EditEntityTranscoder from './app/EditEntityTranscoderView.vue';
import EditEntityTranscoderDialog from './app/EditEntityTranscoderDialog.vue';
import EditProgram from './app/EditProgramView.vue';
import EditRelation from './app/EditRelationView.vue';
import EditRelationDialog from './app/EditRelationDialog.vue';
import InputDialog from './app/InputDialog.vue';
import NotifyDialog from './app/NotifyDialog.vue';
import ProjectHistoryList from './app/ProjectHistoryList.vue';
import RunProgram from './app/RunProgramView.vue';
import RunProgramDialog from './app/RunProgramDialog.vue';
import SimpleInputDialog from './app/SimpleInputDialog.vue';
import TestFunctionDialog from './app/TestFunctionDialog.vue';
import TestOperationDialog from './app/TestOperationDialog.vue';
import TestProgramDialog from './app/TestProgramDialog.vue';
import TestProgram from './app/TestProgramView.vue';
import OperationCatalogueDialog from './app/OperationCatalogue.vue';
import OperationInfoDialog from './app/OperationInfo.vue';
import GetProgramDialog from './app/GetProgramDialog.vue';
import ValueDialog from './app/ValueDialog.vue';
import PreferenceDialog from './app/PreferenceDialog.vue';
import Validation from './app/Validation.vue';
import ChildFilter from './app/ChildFilter.vue';
import Namer from './app/Namer.vue';
import DefinitionsReference from './app/DefinitionsReference.vue';

import { FocusOnVisible, FocusOnCreate, FocusOnChange } from './app/Focus';
import { ShortcutDirective } from './app/Shortcuts';
import { SystemEventsDirective } from './app/SystemEvents';


export * from './app/BuildType';
export * from './app/Confirm';
export * from './app/Data';
export * from './app/DataExport';
export * from './app/DataImport';
export * from './app/DataLocal';
export * from './app/Debugger';
export * from './app/DebugProgram';
export * from './app/DescribeData';
export * from './app/DisplayData';
export * from './app/EntityBuilders';
export * from './app/EditFunction';
export * from './app/EditEntity';
export * from './app/EditEntityIndex';
export * from './app/EditEntityTranscoder';
export * from './app/EditRelation';
export * from './app/EventBase';
export * from './app/FileExport';
export * from './app/FileImport';
export * from './app/GetProgram';
export * from './app/Icons';
export * from './app/Input';
export * from './app/LinkedNode';
export * from './app/Notify';
export * from './app/ProjectExport';
export * from './app/ProjectImport';
export * from './app/ProjectVersions';
export * from './app/Promiser';
export * from './app/RunProgram';
export * from './app/SimpleInput';
export * from './app/StopWatch';
export * from './app/Store';
export * from './app/SystemEvents';
export * from './app/TestFunction';
export * from './app/TestOperation';
export * from './app/TestProgram';
export * from './app/Transcoder';
export * from './app/Value';

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
    Vue.component('ex-expression-editor', ExpressionEditor);
    Vue.component('ex-expression-clipboard', ExpressionClipboard);
    Vue.component('ex-chip-menu', ChipMenu);
    Vue.component('ex-child-filter', ChildFilter);

    Vue.component('ex-explorer-file', ExplorerFile);
    Vue.component('ex-explorer-folder', ExplorerFolder);
    Vue.component('ex-explorer-program', ExplorerProgram);
    Vue.component('ex-explorer-program-folder', ExplorerProgramFolder);
    Vue.component('ex-explorer-data', ExplorerData);
    Vue.component('ex-explorer-data-folder', ExplorerDataFolder);
    Vue.component('ex-explorer-function', ExplorerFunction);
    Vue.component('ex-explorer-function-folder', ExplorerFunctionFolder);
    Vue.component('ex-explorer-entity', ExplorerEntity);
    Vue.component('ex-explorer-entity-folder', ExplorerEntityFolder);
    Vue.component('ex-explorer-relation', ExplorerRelation);
    Vue.component('ex-explorer-relation-folder', ExplorerRelationFolder);

    Vue.component('ex-build-type', BuildType);
    Vue.component('ex-build-type-dialog', BuildTypeDialog);
    Vue.component('ex-confirm-dialog', ConfirmDialog);
    Vue.component('ex-debug-program', DebugProgram);
    Vue.component('ex-debug-program-dialog', DebugProgramDialog);
    Vue.component('ex-describe-data', DescribeData);
    Vue.component('ex-describe-data-dialog', DescribeDataDialog);
    Vue.component('ex-display-data', DisplayData);
    Vue.component('ex-display-data-dialog', DisplayDataDialog);
    Vue.component('ex-edit-function', EditFunction);
    Vue.component('ex-edit-function-dialog', EditFunctionDialog);
    Vue.component('ex-edit-data', EditData);
    Vue.component('ex-edit-entity', EditEntity);
    Vue.component('ex-edit-entity-dialog', EditEntityDialog);
    Vue.component('ex-edit-entity-index', EditEntityIndex);
    Vue.component('ex-edit-entity-index-dialog', EditEntityIndexDialog);
    Vue.component('ex-edit-entity-transcoder', EditEntityTranscoder);
    Vue.component('ex-edit-entity-transcoder-dialog', EditEntityTranscoderDialog);
    Vue.component('ex-edit-program', EditProgram);
    Vue.component('ex-edit-relation', EditRelation);
    Vue.component('ex-edit-relation-dialog', EditRelationDialog);
    Vue.component('ex-input-dialog', InputDialog);
    Vue.component('ex-simple-input-dialog', SimpleInputDialog);
    Vue.component('ex-notify-dialog', NotifyDialog);
    Vue.component('ex-project-history-list', ProjectHistoryList);
    Vue.component('ex-run-program', RunProgram);
    Vue.component('ex-run-program-dialog', RunProgramDialog);
    Vue.component('ex-test-function-dialog', TestFunctionDialog);
    Vue.component('ex-test-operation-dialog', TestOperationDialog);
    Vue.component('ex-test-program', TestProgram);
    Vue.component('ex-test-program-dialog', TestProgramDialog);
    Vue.component('ex-operation-catalogue-dialog', OperationCatalogueDialog);
    Vue.component('ex-operation-info-dialog', OperationInfoDialog);
    Vue.component('ex-get-program-dialog', GetProgramDialog);
    Vue.component('ex-value-dialog', ValueDialog);
    Vue.component('ex-preference-dialog', PreferenceDialog);
    Vue.component('ex-definitions-reference', DefinitionsReference);

    Vue.component('ex-namer', Namer);
    Vue.component('ex-data-string', DataString);
    Vue.component('ex-data-menu', DataMenu);
    Vue.component('ex-data-string-box', DataStringBox);
    Vue.component('ex-type-string-box', TypeStringBox);
    Vue.component('ex-color-picker', ColorPicker);
    Vue.component('ex-date-picker', DatePicker);
    Vue.component('ex-simple-fields', SimpleFields);
    Vue.component('ex-draggable', Draggable);
    Vue.component('ex-templated', Templated);
    Vue.component('ex-validation', Validation);
    Vue.component('ex-shortcut-input', ShortcutInput);
    Vue.component('ex-shortcut-label', ShortcutLabel);

    Vue.directive('focus-on-visible', FocusOnVisible);
    Vue.directive('focus-on-create', FocusOnCreate);
    Vue.directive('focus-on-change', FocusOnChange);
    Vue.directive('shortcuts', ShortcutDirective);
    Vue.directive('system-events', SystemEventsDirective);

    Vue.directive('click-outside', ClickOutside);

    Vue.use(VueTimeago, {});
    Vue.use(wysiwyg, {});
    
    Vue.component('vue-markdown', VueMarkdown);
  },
};

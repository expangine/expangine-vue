
import Vue from 'vue';

import './app.less';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import Draggable from 'vuedraggable';


import TypeEditor from './runtime/types/TypeEditor.vue';
import TypeEditorMenu from './runtime/types/TypeEditorMenu.vue';
import TypeInput from './runtime/types/TypeInput.vue';
import TypeHookList from './runtime/types/TypeHookList.vue';
import Expression from './runtime/exprs/Expression.vue';
import PathEditor from './runtime/exprs/common/PathEditor.vue';
import PathViewer from './runtime/exprs/common/PathViewer.vue';
import ExpressionMenu from './runtime/exprs/common/ExpressionMenu.vue';
import LeftColumn from './components/LeftColumn.vue';
import ChipMenu from './components/ChipMenu.vue';
import ColorPicker from './components/ColorPicker.vue';
import DatePicker from './components/DatePicker.vue';
import SimpleFields from './components/SimpleFields.vue';
import Templated from './components/Templated.vue';


Vue.config.productionTip = false;

Vue.component('ex-type-editor', TypeEditor);
Vue.component('ex-type-editor-menu', TypeEditorMenu);
Vue.component('ex-type-input', TypeInput);
Vue.component('ex-type-hook-list', TypeHookList);
Vue.component('ex-expression', Expression);
Vue.component('ex-path-editor', PathEditor);
Vue.component('ex-path-viewer', PathViewer);
Vue.component('ex-expression-menu', ExpressionMenu);
Vue.component('ex-columns', LeftColumn);
Vue.component('ex-chip-menu', ChipMenu);
Vue.component('ex-color-picker', ColorPicker);
Vue.component('ex-date-picker', DatePicker);
Vue.component('ex-simple-fields', SimpleFields);
Vue.component('ex-draggable', Draggable);
Vue.component('ex-templated', Templated);


new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

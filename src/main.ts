import Vue from 'vue';
import App from './App.vue';
import router from './router';

import TypeEditor from './runtime/TypeEditor.vue';
import TypeEditorMenu from './runtime/TypeEditorMenu.vue';
import TypeInput from './runtime/TypeInput.vue';
import ColorPicker from './components/ColorPicker.vue';
import DatePicker from './components/DatePicker.vue';

import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.component('ex-type-editor', TypeEditor);
Vue.component('ex-type-editor-menu', TypeEditorMenu);
Vue.component('ex-type-input', TypeInput);
Vue.component('ex-color-picker', ColorPicker);
Vue.component('ex-date-picker', DatePicker);


new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

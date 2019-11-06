
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import Expangine from './index';
import App from './App.vue';
import './registerServiceWorker';

Vue.use(Vuetify);
Vue.use(Expangine);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

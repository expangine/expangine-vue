
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import Router from 'vue-router';
import Expangine from './index';
import App from './App.vue';
import Editor from './Editor.vue';
import Shared from './Shared.vue';
import Interface from './Interface.vue';
import './registerServiceWorker';

Vue.use(Vuetify);
Vue.use(Expangine);
Vue.use(Router);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});

const router = new Router({
  routes: [
    { path: '/', component: Editor },
    { path: '/shared/:id', component: Shared, props: (route) => ({ projectName: route.params.id, programName: route.query.program }) },
    { path: '/ui', component: Interface },
    { path: '*', redirect: '/' },
  ],
});

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');

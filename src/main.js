import Vue from 'vue';
import axios from 'axios';
import Vuelidate from 'vuelidate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import ArgonDashboard from './plugins/argon-dashboard';
import store from './store';

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

// Add Font-awesome icons
library.add(fas, far);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(ArgonDashboard);
Vue.use(Vuelidate);

store.dispatch('checkLogin');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

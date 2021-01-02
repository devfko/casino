import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import axios from 'axios';

import router from './routes';
import store from './store';

Vue.config.productionTip = false;
axios.defaults.baseURL = (process.env.VUE_APP_NODE_ENV === 'production') ? process.env.VUE_APP_URL_API_PROD : process.env.VUE_APP_URL_API_LOCAL;

new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app');
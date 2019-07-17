import Vue from 'vue';
import Vuetify from 'vuetify';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vuetify/dist/vuetify.min.css';
import fireBaseConfig from '../firebase_client_config.json';

Vue.use(Vuetify, {
  primary: '#1976D2',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
});

Vue.config.productionTip = false;

firebase.initializeApp(fireBaseConfig);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

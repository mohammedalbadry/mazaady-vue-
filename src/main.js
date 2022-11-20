import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"


Vue.config.productionTip = false
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://localhost:8080/api';

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')

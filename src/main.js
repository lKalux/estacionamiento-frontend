import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.css'
import '@/assets/styles/global.scss';





Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

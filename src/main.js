import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMeta from "vue-meta";

Vue.config.productionTip = false
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

new Vue({
  metaInfo: () => ({
    title: 'Главная',
    titleTemplate: '%s | ToDo',
  }),
  router,
  store,
  render: h => h(App)
}).$mount('#app')

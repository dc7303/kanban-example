import Vue from 'vue';
import App from './App.vue';
import yorkie from './yorkie';

async function initYorkie() {
  // yorkie-js-sdk serves its envoy endpoint as localhost:8080
  const client = yorkie.createClient('http://localhost:8080');
  await client.activate();
  Vue.prototype.$client = client;
}

initYorkie().then(() => { 
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(App),
  }).$mount('#app');
});
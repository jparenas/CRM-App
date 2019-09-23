import "reflect-metadata";

import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import App from "./App.vue";
import { router } from "./router/router";
import store from "./store/store";
import "./registerServiceWorker";
import VueCookies from "vue-cookies";
import { apolloClient } from "@/plugins/apollo";
import VueApollo from "vue-apollo";
import Vuelidate from "vuelidate";

Vue.use(Vuelidate);
Vue.use(VueCookies);
Vue.use(VueApollo);

Vue.config.productionTip = false;

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

new Vue({
  vuetify,
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");

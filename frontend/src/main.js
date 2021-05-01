import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

Vue.config.productionTip = false; //pour ne plus avoir de notification de production au démarrage de Vue

Vue.use(Vuelidate); //validation découplées du modèles

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App), // h est un alias de createElement  abréviation de : render : function ( createElement ) { return createElement (App) ;}
}).$mount("#app");

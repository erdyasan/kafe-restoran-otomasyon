import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/src/jquery.js";
import "bootstrap/dist/js/bootstrap.min.js";
import { auth } from "./includes/firebase";

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.mount("#app");
  }
});

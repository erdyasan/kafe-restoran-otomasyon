import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
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

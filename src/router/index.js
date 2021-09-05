import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import store from "@/store";
const Login = () => import("@/views/Login.vue");
const Register = () => import("@/views/Register.vue");
const Masalar = () => import("@/views/Masalar.vue");
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/masaSiparisAl/:id",
    name: "MasaSiparisAl",
    component: () => import("@/views/MasaSiparisAl.vue"),
  },
  {
    path: "/mutfak",
    name: "Mutfak",
    component: () => import("@/views/Mutfak.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/kasa/detail/:id",
    name: "KasaDetail",
    component: () => import("@/views/KasaDetail.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/masalar",
    name: "Masalar",
    component: Masalar,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/kasa",
    name: "Kasa",
    component: () => import("@/views/Kasa.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/urunler",
    name: "Urunler",
    component: () =>
      import(/* webpackChunkName: "urunler" */ "@/views/Urunler.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/siparis",
    name: "Siparis",
    meta: {
      requireAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "siparis" */ "@/views/Siparis.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requireAuth: false,
      cantLogifLogged: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requireAuth: false,
      cantLogifLogged: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  if (
    !to.matched.some((record) => record.meta.requireAuth) &&
    !store.state.auth.userLoggedin
  ) {
    next();
    return;
  }

  if (
    to.matched.some((record) => record.meta.cantLogifLogged) &&
    store.state.auth.userLoggedin
  ) {
    router.push({ name: "Home" });
    return;
  }

  if (store.state.auth.userLoggedin) {
    next();
    return;
  } else {
    router.push({ name: "Login" });
  }
});
export default router;

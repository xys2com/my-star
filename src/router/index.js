import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/home",
  },
  {
    path: "/moon",
    name: "Moon",
    component: () => import("@/views/Moon.vue"),
  },
  {
    path: "/inverted",
    name: "Inverted",
    component: () => import("@/views/Inverted.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/Test.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: "./",
  routes,
});

export default router;

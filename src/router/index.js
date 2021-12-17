import Vue from "vue";
import VueRouter from "vue-router";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
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
  {
    path: "/menus",
    name: "menus",
    component: () => import("@/views/Menus.vue"),
  },
  {
    path: "/other",
    name: "other",
    component: () => import("@/views/Other.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: "./",
  routes,
});

export default router;

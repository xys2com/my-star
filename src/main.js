import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import El from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import canvas from "./plugin/index";
import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";
import "vant/lib/index.css";
Vue.config.productionTip = false;
Vue.use(preview, {
  maxSpreadZoom: 1.4,
});
Vue.use(El);
Vue.use(canvas);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

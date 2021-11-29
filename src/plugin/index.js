import Canvas from "./Canvas.vue";
import Line from "./components/Line.vue";
import Square from "./components/Square.vue";
let canvas = {};
canvas.install = function (Vue) {
  Vue.component("easy-canvas", Canvas);
  Vue.component("e-line", Line);
  Vue.component("e-square", Square);
};
export default canvas;

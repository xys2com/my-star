<!-- eslint-disable-next-line -->
<template></template>
<script>
import { radiusSquare } from "../tool";
export default {
  name: "cvs-line",
  data() {
    return {
      e: "e",
      canvas: null,
      context: null,
      drawProps: {},
    };
  },
  props: {
    position: {},
    lineWidth: {
      type: Number,
      default: 1,
    },
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 50,
    },
    // 可以是纯色，可以是canvas渐变色对象,
    color: {
      // eslint-disable-next-line
      type: String | Object,
      default: () => {
        return "#000";
      },
    },
    radius: {
      type: Number,
      default: 0,
    },
    lineCap: {
      // butt round square
      type: String,
      default: "butt",
    },
    lineJoin: {
      // miter bevel round
      type: String,
      default: "miter",
    },
    miterlimit: {
      // 只有 lineJoin = miter 才会生效
      type: Number,
      default: 10,
    },
    reset: {
      // 是否重置画笔状态
      type: Boolean,
      default: false,
    },
  },
  watch: {
    "position.x": {
      handler() {
        this.viewChange();
      },
      immediate: true,
    },
    "position.y": {
      handler() {
        this.viewChange();
      },
      immediate: true,
    },
    width() {
      this.viewChange();
    },
    height() {
      this.viewChange();
    },
    color() {
      this.viewChange();
    },
    radius() {
      this.viewChange();
    },
    lineWidth(v) {
      this.addChangeProp("lineWidth", v);
    },
    lineCap(v) {
      this.addChangeProp("lineCap", v);
    },
    lineJoin(v) {
      this.addChangeProp("lineJoin", v);
    },
    miterlimit(v) {
      this.addChangeProp("miterlimit", v);
    },
  },
  methods: {
    load() {
      const getParent = ($component) =>
        $component.abstract || $component.$el === $component.$children[0].$el
          ? getParent($component.$parent)
          : $component;
      const { canvas, context } = getParent(this.$parent);
      // eslint-disable-next-line
      if (!context.hasOwnProperty("radiusSquare")) {
        context.radiusSquare = radiusSquare;
      }
      this.canvas = canvas;
      this.context = context;
    },
    draw() {
      const { width: w, height: h, color, context: ctx, radius: r } = this;
      const { x, y } = this.position;
      if (this.reset) ctx.save();
      if (r > 0) {
        ctx.radiusSquare(x, y, w, h, r);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y);
      }
      for (let key in this.drawProps) {
        ctx[key] = this.drawProps[key];
      }
      ctx.fillStyle = color;
      ctx.fill();
      if (this.reset) ctx.save();
    },
    // 绘制属性改变
    addChangeProp(n, v) {
      this.drawProps[n] = v;
      // this.$parent.clear();
      this.draw();
    },
    // 图形属性改变
    viewChange() {
      const { canvas, context } = this;
      if (!canvas || !context) {
        this.load();
      }
      // this.$parent.clear();
      this.draw();
    },
  },
  mounted() {
    this.$parent.save(this);
  },
};
</script>

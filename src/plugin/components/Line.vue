<!-- eslint-disable-next-line -->
<template></template>
<script>
import { arrayEquals } from "../tool";
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
    points: [],
    lineWidth: {
      type: Number,
      default: 1,
    },
    // 可以是颜色，可以是canvas渐变色对象,
    color: {
      // eslint-disable-next-line
      type: Object | String,
      default: () => {
        return "#000";
      },
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
    points: {
      handler(v, o) {
        if (!arrayEquals(v, o)) {
          if (v.length > 1) {
            const { canvas, context } = this;
            if (!canvas || !context) {
              this.load();
            }
            this.draw();
          }
        }
      },
      immediate: true,
    },
    color() {
      // this.$parent.clear();
      this.draw();
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
      this.canvas = canvas;
      this.context = context;
    },
    draw() {
      const ctx = this.context;
      if (this.reset) ctx.save();
      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i];
        if (i === 0) {
          ctx.moveTo(...p);
        } else {
          ctx.lineTo(...p);
        }
      }
      for (let key in this.drawProps) {
        ctx[key] = this.drawProps[key];
      }
      ctx.strokeStyle = this.color;
      ctx.stroke();
      if (this.reset) ctx.restore();
    },
    addChangeProp(n, v) {
      this.drawProps[n] = v;
      // this.$parent.clear();
      this.draw();
    },
  },
  mounted() {
    this.$parent.save(this);
  },
};
</script>

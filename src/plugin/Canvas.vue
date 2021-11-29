<template>
  <div style="width: 100%; height: 100%">
    <div :id="id" style="width: 100%; height: 100%"></div>
    <div class="child" v-if="init">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "canvas-main",
  data() {
    return {
      e: "e",
      id: `canvas-wrap-${Math.random().toString(32).slice(-8)}`,
      canvas: null,
      context: null,
      init: false,
      segment: [],
    };
  },
  methods: {
    ininCanvas() {
      let canvas, context;
      this.canvas = canvas = document.createElement("canvas");
      const dom = document.getElementById(this.id);
      canvas.width = dom.offsetWidth;
      canvas.height = dom.offsetHeight;
      dom.appendChild(canvas);
      this.context = context = canvas.getContext("2d");
      const item = { canvas, context };
      this.init = true;
      this.$emit("ready", item);
    },
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    save(el) {
      this.segment.push(el);
    },
    redraw() {
      console.log(this.redraw);
      this.clear();
      this.segment.forEach((e) => {
        e.draw();
      });
    },
    // redraw() {
    //   this.clear();
    //   this.init = false;
    //   this.$nextTick(() => {
    //     this.init = true;
    //   });
    // },
  },
  mounted() {
    this.ininCanvas();
  },
};
</script>
<style></style>

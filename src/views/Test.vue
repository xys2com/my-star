<template>
  <div style="width: 100vw; height: 100vh; margin: 0 auto">
    <div style="width: 800px; height: 600px; margin: 0 auto">
      <easy-canvas @ready="initCanvas">
        <e-line
          :points="[
            [100, 200],
            [200, 200],
          ]"
          :line-width="lw"
          color="red"
        ></e-line>
        <e-square
          :position="{ x: square.x, y: square.y }"
          :color="square.color"
          :radius="Number(square.radius)"
          :height="Number(square.height)"
          :width="Number(square.width)"
        ></e-square>
      </easy-canvas>
    </div>
    <div class="width: 1000px; height: calc(100vh - 600px); margin: 0 auto;">
      四边形: 宽：<input type="text" v-model="square.width" />&nbsp; 高：<input
        type="text"
        v-model="square.height"
      />&nbsp; 圆角：<input type="text" v-model="square.radius" />&nbsp;
      x：<input type="text" v-model="square.x" />&nbsp; y：<input
        type="text"
        v-model="square.y"
      />&nbsp;
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      e: "e",
      canvas: null,
      ctx: null,
      lw: null,
      square: {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        radius: 10,
      },
    };
  },
  methods: {
    initCanvas({ canvas, context }) {
      this.canvas = canvas;
      this.ctx = context;
    },
    setLineW(n) {
      this.lw = n;
    },
  },
  mounted() {},
};
</script>
<style></style>

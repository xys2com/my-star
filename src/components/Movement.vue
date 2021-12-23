<template>
  <div
    :id="movementAreaId"
    class="movement-area"
    @mousemove="getMousePos"
  ></div>
</template>
<script>
import { random } from "@/utils/tool";
export default {
  name: "App",
  data() {
    return {
      movementAreaId: `move-area-${Math.random()
        .toString(32)
        .slice(-8)}-${Date.parse(new Date())}`,
      canvas: null,
      ctx: null,
      movePath: [],
      mousePreTimer: Date.now(),
    };
  },
  methods: {
    canvasInit() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
    },
    getMousePos(e) {
      let now = Date.now();
      if (now - this.mousePreTimer < 50) {
        return;
      }
      this.mousePreTimer = now;
      const pos = {
        x: e.clientX,
        y: e.clientY,
      };
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.movement-area {
  position: absolute;
  height: 100vh;
  width: 100vw;
}
</style>

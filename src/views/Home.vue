<template>
  <div class="home">
    <div class="canvas-main" :id="canvasRandomId">
      <StarrySky
        @add="addAnm"
        @remove="removeAnm"
        @updateBackground="updateBackground"
      />
    </div>
    <Player
      :canvas-id="canvasRandomId"
      ref="player"
      @add="addAnm"
      @remove="removeAnm"
      :img.sync="img"
      @staroverturnrender="starOverturnRender"
    />
  </div>
</template>
<script>
import { mobileTypeJudge } from "@/utils/tool";
import Player from "@/components/Player.vue";
import StarrySky from "@/components/StarrySky.vue";
export default {
  name: "App",
  components: {
    Player,
    StarrySky,
  },
  data() {
    return {
      canvasRandomId: "",
      anm: null,
      allAnmFnOptions: [],
      img: null,
      isMobile: false,
    };
  },
  watch: {
    allAnmFnOptions: "hasTasks",
  },
  created() {
    this.canvasRandomId =
      "canvas-area-" +
      Math.random().toString(36).slice(-8) +
      Date.parse(new Date());
  },
  methods: {
    hasTasks(v) {
      if (v.length > 0) {
        this.startAnm();
      } else {
        this.stop();
      }
    },
    // 停止动画
    stop() {
      window.cancelAnimationFrame(this.anm);
      this.anm = null;
    },
    // 开始动画
    startAnm() {
      if (this.anm === null) {
        this.anm = window.requestAnimationFrame(this.runAnm);
      }
    },
    // 添加动画执行项
    addAnm(option) {
      this.allAnmFnOptions.push(option);
    },
    // 删除动画
    removeAnm(id) {
      const index = this.allAnmFnOptions.findIndex((e) => {
        return (e.id = id);
      });
      if (index !== -1) {
        this.allAnmFnOptions.splice(index, 1);
      }
    },
    // 遍历动画项并执行内容
    runAnm() {
      if (this.allAnmFnOptions.length === 0) {
        window.cancelAnimationFrame(this.anm);
        this.anm = null;
        return;
      }
      this.allAnmFnOptions.forEach((e) => {
        if (e.params) {
          e.fun(...e.params);
        } else {
          e.fun();
        }
      });
      window.requestAnimationFrame(this.runAnm);
    },
    // 开始渲染
    starOverturnRender(img) {
      const wave = this.$refs.wave;
      wave.startRender && wave.startRender(img);
    },
    //
    updateBackground() {
      const player = this.$refs.player;
      player && player.updateBackgroundBase64();
    },
  },
  mounted() {
    window.anmStop = this.stop;
    // 是否移动端
    this.isMobile = mobileTypeJudge().isMobile;
    if (this.isMobile) {
      // 移动端只做临时兼容处理，更佳效果请移步pc端
      this.$message({
        message: "更佳效果请移步pc端",
        duration: 3000,
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "styles/common.scss";
.home {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 10;
  top: 0;
  .canvas-main {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(rgb(4, 4, 38), rgb(70, 76, 134));
  }
}
</style>

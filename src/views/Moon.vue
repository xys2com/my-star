<template>
  <div class="main-view">
    <music-list @anm="runAnm" @add="addAnm" @stop="stop" />
    <starry-sky @anm="runAnm" @add="addAnm" @stop="stop" />
  </div>
</template>
<script>
import musicList from "@/components/MusicList.vue";
import starrySky from "@/components/StarrySky.vue";
export default {
  components: {
    "music-list": musicList,
    "starry-sky": starrySky,
  },
  data() {
    return {
      e: "e",
      ANM: null,
      allOptions: [],
    };
  },
  watch: {
    allOptions: "hasOp",
  },
  methods: {
    // 任务列中是否存在任务
    hasOp(v) {
      if (v.length > 0) {
        this.startAnm();
      } else {
        this.stop();
      }
    },
    // 停止动画
    stop() {
      window.cancelAnimationFrame(this.ANM);
    },
    // 开始动画
    startAnm() {
      if (this.ANM === null) {
        this.ANM = window.requestAnimationFrame(this.runAnm);
      } else {
        window.requestAnimationFrame(this.runAnm);
      }
    },
    // 添加动画执行项
    addAnm(option) {
      this.allOptions.push(option);
    },
    // 遍历动画项并执行内容
    runAnm() {
      this.allOptions.forEach((e) => {
        if (e.params) {
          e.fun(...e.params);
        } else {
          e.fun();
        }
      });
      if (this.ANM === null) {
        this.ANM = window.requestAnimationFrame(this.runAnm);
      } else {
        window.requestAnimationFrame(this.runAnm);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main-view {
  height: 100%;
  width: 100%;
  .canvas-wrap {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    v-deep canvas {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>

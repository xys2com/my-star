<template>
  <div class="progress-wrap" ref="wrap">
    <div class="progress" @click="setMusicPro" ref="outer">
      <div class="progress-inner" :style="`width:${value}%`"></div>
      <p @click.stop ref="dot"></p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    progressValue: {
      type: Number,
      default: 0,
      dotMove: false,
    },
  },
  data() {
    return {
      value: 0,
    };
  },
  watch: {
    progressValue: function (v) {
      this.value = v;
    },
  },
  mounted() {
    const dot = this.$refs.dot;
    const outer = this.$refs.outer;
    const wrap = this.$refs.wrap;
    // let startX = 0,
    //   endX = 0;
    dot.addEventListener("mousedown", () => {
      this.dotMove = true;
    });
    wrap.addEventListener("mousemove", (e) => {
      if (this.dotMove) {
        let v = (((e.pageX - 20) / outer.offsetWidth) * 100).toFixed(2);
        v = v > 100 ? 100 : v;
        v = v < 0 ? 0 : v;
        this.value = v;
      }
    });
    wrap.addEventListener("mouseup", () => {
      if (this.dotMove) {
        this.dotMove = false;
        this.$emit("setMusicProgress", this.value);
      }
    });
  },
  methods: {
    setMusicPro(e) {
      const outer = this.$refs.outer;
      let v = ((e.offsetX / outer.offsetWidth) * 100).toFixed(2);
      v = v > 100 ? 100 : v;
      v = v < 0 ? 0 : v;
      this.value = v;
      this.$emit("setMusicProgress", this.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.progress-wrap {
  height: 60px;
  width: 100%;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0.2;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.75;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  .progress {
    height: 4px;
    width: 100%;
    background: #ebeef5;
    border-radius: 2px;
    // overflow: hidden;
    cursor: pointer;
    display: flex;
    position: relative;
    .progress-inner {
      height: 100%;
      background: #409eff;
      border-radius: 2px;
    }
    p {
      cursor: pointer;
      margin: 0;
      height: 6px;
      margin-top: -1px;
      width: 6px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0px 1px 3px rgba(255, 255, 255, 1),
        0px -1px 3px rgba(255, 255, 255, 18), 1px 0px 3px rgba(255, 255, 255, 1),
        -1px 0px 3px rgba(255, 255, 255, 1);
    }
  }
}
</style>

<template>
  <div
    class="starry-sky canvas-wrap"
    ref="canvas-wrap"
    @mousemove="setOffset"
    :style="`transform: rotateX(${cvsOffsetConfig.ofsY}deg) rotateY(${cvsOffsetConfig.ofsX}deg);`"
  >
    <canvas name="sta" ref="sta" onwave="1" />
    <canvas name="mov" ref="mov" />
    <canvas name="met" ref="met" />
    <canvas name="moo" ref="moo" onwave="1" />
    <canvas name="wave" ref="wave" v-if="!isMobile" />
  </div>
</template>
<script>
import { mobileTypeJudge } from "@/utils/tool";
import { CreateWave } from "@/utils/wave";
import { StaticStar, MoveStar, SmallMeteor } from "@/utils/star-view-anm";
export default {
  data() {
    return {
      // 动态星星数量
      moverStarNum: 600,
      // 静态星星数量
      stticStarNum: 15,
      // 流星数量
      meteorNum: 30,
      staticStars: [],
      moveStars: [],
      meteor: [],
      width: 1920,
      height: 1080,
      // 流星移动速度
      meteorV: 3,
      // 动态星星不渲染的 x|y 上限
      limitX: 1920,
      limitY: 1080,
      isMobile: false,
      //
      waveHeight: 0.6,
      recoverTimeout: null,
      mouseMoveTimer: Date.now(),
      cvsOffsetConfig: {
        startx: 0,
        starty: 0,
        ofsX: 0,
        ofsY: 0,
      },
    };
  },
  methods: {
    viewInit() {
      this.width = document.body.offsetWidth;
      this.height = document.body.offsetHeight;
      this.limitX = this.isMobile
        ? document.body.offsetWidth * 2
        : document.body.offsetWidth;
      this.limitY = this.isMobile
        ? document.body.offsetHeight * 2
        : document.body.offsetHeight * this.waveHeight;

      let sta = this.$refs.sta;
      let mov = this.$refs.mov;
      let met = this.$refs.met;
      let moo = this.$refs.moo;
      let wave = this.$refs.wave;

      let _Width, _Height;
      if (this.isMobile) {
        _Width = this.width * 2;
        _Height = this.height * 2;
      } else {
        _Width = this.width;
        _Height = this.height;
      }
      sta.width = mov.width = met.width = moo.width = wave.width = _Width;
      sta.height = mov.height = met.height = moo.height = wave.height = _Height;
      // if (this.isMobile) {
      //   sta.style.transform =
      //     mov.style.transform =
      //     met.style.transform =
      //     moo.style.transform =
      //     wave.style.transform =
      //       `scale(0.5, 0.5) translate(-50%, -50%)`;
      // }

      let stactx = sta.getContext("2d");
      let movctx = mov.getContext("2d");
      // let metctx = met.getContext("2d");
      let mooctx = moo.getContext("2d");
      // let wavectx = wave.getContext("2d");
      this.createStaticStar(sta, stactx);
      this.createMoveStar(mov, movctx);
      // this.createMeteor(met, metctx);
      this.createMoon(moo, mooctx);
    },
    // 初始化静态的星星
    createStaticStar(cvs, ctx) {
      ctx.save();
      for (var i = 0; i < this.stticStarNum; i++) {
        let star = new StaticStar({
          width: cvs.width,
          height: cvs.height,
          isMobile: this.isMobile,
        });
        star.draw(ctx);
        this.staticStars.push(star);
      }
      ctx.restore();
    },
    // 初始化动态星星
    createMoveStar(cvs, ctx) {
      let moverStarNum = this.isMobile
        ? this.moverStarNum
        : this.moverStarNum * 1.5;
      this.moveStars = [];
      for (var i = 0; i < moverStarNum; i++) {
        let star = new MoveStar({
          width: cvs.width,
          height: cvs.height,
          limitX: this.limitX,
          limitY: this.limitY,
          isMobile: this.isMobile,
        });
        star.draw(ctx);
        this.moveStars.push(star);
      }
      const fun = (ctx, stars) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        stars.forEach((e) => {
          e.draw(ctx);
        });
      };
      const params = [ctx, this.moveStars];
      const option = {
        fun,
        name: "move-star",
        params,
      };
      this.$emit("add", option);
    },
    // 初始化流星
    createMeteor(cvs, ctx) {
      this.meteor = [];
      for (let i = 0; i < this.meteorNum; i++) {
        let star = new SmallMeteor({
          width: cvs.width,
          height: cvs.height,
          isMobile: this.isMobile,
        });
        star.draw(ctx);
        this.meteor.push(star);
      }
      const fun = (ctx, stars) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        stars.forEach((e) => {
          e.draw(ctx);
        });
      };
      const params = [ctx, this.meteor];
      const option = {
        fun,
        name: "meteor",
        params,
      };
      this.$emit("add", option);
    },
    // 月亮
    async createMoon(cvs, ctx) {
      let c = document.createElement("canvas");
      let _ctx = c.getContext("2d");
      let img = new Image();
      img.src = require("@/assets/images/moon.png"); //getImgUrl()
      let _this = this;
      img.onload = await function () {
        c.width = _this.isMobile ? 300 : 450;
        c.height = _this.isMobile ? 300 : 450;
        let crc_x = c.width / 2,
          crc_y = c.height / 2,
          R = c.height / 2;

        _ctx.drawImage(img, c.width / 4, c.height / 4, crc_x, crc_y);

        let grd = _ctx.createRadialGradient(R, R, 0, R, R, c.width / 2);
        //月亮光晕
        grd.addColorStop(0.5, "rgba(255,239,180,.4)");
        grd.addColorStop(0.6, "rgba(255,239,180,.25)");
        grd.addColorStop(0.7, "rgba(255,239,180,.125)");
        grd.addColorStop(0.8, "rgba(255,239,180,.0625)");
        grd.addColorStop(0.9, "rgba(255,239,180,.03)");
        grd.addColorStop(1, "transparent");

        _ctx.fillStyle = grd;
        _ctx.beginPath();
        _ctx.arc(R, R, R, 0, Math.PI * 2);
        _ctx.fill();

        ctx.globalCompositeOperation = "destination-over";
        ctx.globalAlpha = 1;
        if (_this.isMobile) {
          ctx.drawImage(c, ctx.canvas.width - c.width, 0, c.width, c.height);
        } else {
          let x = (ctx.canvas.width - c.width) / 2,
            y = _this.height * _this.waveHeight - (c.height / 3) * 2;
          ctx.drawImage(c, x, y, c.width, c.height);
        }
        if (!_this.isMobile) {
          let wavecvs = _this.$refs.wave;
          let wavectx = wavecvs.getContext("2d");
          _this.createWave(wavecvs, wavectx);
        }
      };
      // setTimeout(() => {
      //   this.$emit("updateBackground");
      // }, 500);
    },
    // 水波
    async createWave(cvs, ctx) {
      const fn = () => {
        return new Promise((rs) => {
          const refs = this.$refs;
          const onwaveCanvas = [];
          for (let key in refs) {
            if (refs[key].getAttribute("onwave") == "1") {
              onwaveCanvas.push(refs[key]);
            }
          }
          cvs.height = cvs.height * this.waveHeight;
          onwaveCanvas.forEach((e, i) => {
            ctx.drawImage(
              e,
              0,
              0,
              cvs.width,
              cvs.height,
              0,
              0,
              cvs.width,
              cvs.height
            );
            // e.parentNode.removeChild(e);
            if (i === onwaveCanvas.length - 1) {
              rs(true);
            }
          });
        });
      };
      const renderImgKey = await fn();
      if (renderImgKey) {
        const option = await CreateWave({
          waves: 10,
          speed: 0.2,
          scale: 1,
          height: 0.5,
          image: cvs,
        });
        this.createCanvas3dView();
        this.$emit("add", option);
      }
    },
    createCanvas3dView() {
      const canvases = Array.from(this.$refs["canvas-wrap"].children);
      canvases.forEach((e, i) => {
        let num = canvases.length - i;
        if (i === canvases.length - 1) {
          num = canvases.length - (i - 1);
        }
        e.style.transform = `translateZ(-${
          num * 50 + (num / 2) * 50
        }px) scale(1.05)`;
      });
    },
    setOffset(e) {
      let _now_time = Date.now();
      if (_now_time - this.mouseMoveTimer < 150) {
        return;
      }
      this.mouseMoveTimer = _now_time;
      if (
        this.cvsOffsetConfig.startx === 0 &&
        this.cvsOffsetConfig.starty === 0
      ) {
        this.cvsOffsetConfig.startx = e.clientX;
        this.cvsOffsetConfig.starty = e.clientY;
        return;
      }
      let xdeg = (e.clientX - this.cvsOffsetConfig.startx) / 200,
        ydeg = -(e.clientY - this.cvsOffsetConfig.starty) / 200;
      xdeg < -4 ? -4 : xdeg;
      xdeg > 4 ? 4 : xdeg;
      ydeg < -4 ? -4 : ydeg;
      ydeg > 4 ? 4 : ydeg;
      this.cvsOffsetConfig.ofsX = xdeg;
      this.cvsOffsetConfig.ofsY = ydeg;
      window.clearTimeout(this.recoverTimeout);
      this.recoverTimeout = null;
      this.recoverTimeout = setTimeout(() => {
        this.cvsOffsetConfig = {
          startx: 0,
          starty: 0,
          ofsX: 0,
          ofsY: 0,
        };
        window.clearTimeout(this.recoverTimeout);
        this.recoverTimeout = null;
      }, 1500);
    },
  },
  mounted() {
    // 是否移动端
    this.isMobile = mobileTypeJudge().isMobile;
    this.viewInit();
  },
};
</script>
<style lang="scss">
.canvas-wrap {
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
@media screen and (max-width: 750px) {
  .canvas-wrap canvas {
    transform: scale(0.5, 0.5) translate(-50%, -50%) !important;
  }
}
</style>

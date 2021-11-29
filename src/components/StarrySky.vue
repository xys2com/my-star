<template>
  <div class="starry-sky canvas-wrap">
    <canvas name="sta" ref="sta" onwave="1" />
    <canvas name="mov" ref="mov" />
    <canvas name="met" ref="met" />
    <canvas name="moo" ref="moo" onwave="1" />
    <canvas name="wave" ref="wave" />
  </div>
</template>
<script>
import { mobileTypeJudge } from "@/utils/tool";
import { StaticStar, MoveStar, SmallMeteor } from "@/utils/star-view-anm";
export default {
  data() {
    return {
      // 动态星星数量
      moverStarNum: 600,
      // 静态星星数量
      stticStarNum: 20,
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
        : document.body.offsetHeight;

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
      this.moveStars = [];
      for (var i = 0; i < this.moverStarNum; i++) {
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
        params,
      };
      this.$emit("add", option);
    },
    // 月亮
    async createMoon(cvs, ctx) {
      console.log("2");
      let c = document.createElement("canvas");
      let _ctx = c.getContext("2d");
      let img = new Image();
      img.src = require("@/assets/images/moon.png"); //getImgUrl()
      let _this = this;
      img.onload = await function () {
        c.width = 300;
        c.height = 300;
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
        ctx.drawImage(c, ctx.canvas.width - c.width, 0, c.width, c.height);
        let wavecvs = _this.$refs.wave;
        let wavectx = wavecvs.getContext("2d");
        _this.createWave(wavecvs, wavectx);
      };
      setTimeout(() => {
        this.$emit("updateBackground");
      }, 500);
    },
    // 水波
    createWave(cvs, ctx) {
      const refs = this.$refs;
      const onwaveCanvas = [];
      for (let key in refs) {
        if (refs[key].getAttribute("onwave") == "1") {
          onwaveCanvas.push(refs[key]);
        }
      }
      onwaveCanvas.forEach((e) => {
        ctx.drawImage(e, 0, 0, cvs.width, cvs.height);
      });
    },
  },
  mounted() {
    // 是否移动端
    this.isMobile = mobileTypeJudge().isMobile;
    this.viewInit();
  },
};
</script>
<style lang="scss" scoped>
.canvas-wrap {
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
@media screen and (max-width: 750px) {
  canvas {
    transform: scale(0.5, 0.5) translate(-50%, -50%) !important;
  }
}
</style>

<template>
  <div>
    <div class="header-wrap" v-if="!isMobile">
      <canvas class="header-canvas" ref="header-canvas"></canvas>
      <div class="header-left">
        <div class="active-nav-back" :style="`left:${backLightLeft}px`"></div>
        <div
          :class="['item', active === i ? 'active' : '']"
          v-for="(item, i) in navlist"
          :title="item.title"
          :ref="`item-${i}`"
          :key="i"
          @click="navclick($event, item, i)"
        >
          {{ item.name }}
        </div>
        <div class="item active github" v-if="!isMobile" title="点点~">
          <span class="iconfont icon-github" @click="openGithub"></span>
        </div>
      </div>
      <div class="header-right" v-if="checkItem && !isMobile">
        <div class="note" v-html="checkItem.note"></div>
        <p class="subtitle" v-html="checkItem.subtitle"></p>
      </div>
      <div :class="`imglist ${imgshow && !isMobile ? 'show' : ''}`">
        <el-tooltip
          v-for="(item, i) in imgList"
          :key="i"
          class="item"
          effect="dark"
          :content="item.text"
          placement="bottom"
        >
          <div class="img-box">
            <el-image :src="item.src" :preview-src-list="srcList"> </el-image>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="header-mobile" v-else>
      <div :class="`m-head ${touch ? 'touch' : ''}`">
        <img
          src="https://music-960422.oss-cn-beijing.aliyuncs.com/dev/head.png"
          alt=""
          @click="touch = true"
        />
      </div>
      <div
        :class="['m-nav', touch ? 'active' : '']"
        @touchstart="navTouchStart"
        @touchmove="navTouchMove"
      >
        <div class="m-nav-main">
          <canvas class="m-header-canvas" ref="m-header-canvas"></canvas>
          <div class="m-nav-list">
            <div
              class="m-nav-item"
              :class="['item', active === i ? 'active' : '']"
              v-for="(item, i) in navlist"
              :ref="`item-${i}`"
              :key="i"
              @touchstart="navclick($event, item, i)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="m-container">
            <div class="m-imglist">
              <div class="diary-title">我的日记</div>
              <div
                class="m-img-box"
                v-for="(item, i) in imgList"
                :key="i"
                @click="imgView(i)"
              >
                <img :src="item.src" />
              </div>
            </div>
            <div class="m-diary">
              <canvas class="m-diary-canvas" ref="m-diary-canvas"></canvas>
              <div
                class="m-note"
                v-if="checkItem && isMobile"
                v-html="checkItem.note"
              ></div>
              <div
                class="m-subtitle"
                v-if="checkItem && isMobile"
                v-html="checkItem.subtitle"
              ></div>
              <div class="m-other"></div>
            </div>
          </div>
        </div>
        <div class="m-nav-blank" @click="touch = false">
          <span class="iconfont icon-github" @click.stop="openGithub"></span>
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="mobile-tips">点左边头像试试</div>
  </div>
</template>
<script>
import { mobileTypeJudge } from "@/utils/tool";
import { Firefly } from "@/utils/firefly";
import { Ripple } from "@/utils/ripple";
import { random } from "@/utils/tool";

import { ImagePreview } from "vant";
export default {
  name: "App",
  data() {
    return {
      isMobile: false,
      touch: false,
      navlist: [
        {
          name: "星月海",
          title: "星星啊，月亮啊，水啊",
          url: "/",
          hasPage: true,
          note: "光年之外，璀璨零光不可触及；桂光倒悬，此番人间共饮一轮",
          subtitle: "我比他们更明亮，只因我的心离你更近而已。 —— 你好",
        },
        {
          name: "流萤",
          title: "萤火虫诶！",
          hasPage: false,
          note: "夜幕挂星，飞火流萤",
          event: "createFirefly",
          subtitle:
            "树上的蝉、塘里的莲、河里的鱼，鱼跑了，塘旱了，就连那个村也推平了。 —— 童趣",
        },
        {
          name: "狂猪日记",
          title: "来看看猪的白日梦~",
          event: "openDiary",
          hasPage: false,
          note: "我梦见我变成了猪，今后一边怀恋当猪的好，一边想着做人的妙。比较可笑",
          subtitle:
            "猪不会上班，猪不会写字，猪的一生只有一小年，可猪的所有痛苦也只有那最后那一刀。 —— 谁才是猪",
        },
      ],
      active: 0,
      backLightLeft: 0,
      checkItem: null,
      fireflylist: [],
      ripples: [],
      anmId: Math.random().toString(32).slice(-8),
      imgshow: false,
      creating: false,
      limitX: 1920,
      limitY: 1080,
      imgList: [
        {
          src: "https://music-960422.oss-cn-beijing.aliyuncs.com/diary/hl.jpg",
          text: "鲁迅体周五下班日记",
        },
        {
          src: "https://music-960422.oss-cn-beijing.aliyuncs.com/diary/sd.jpg",
          text: "悟一悟",
        },
        {
          src: "https://music-960422.oss-cn-beijing.aliyuncs.com/diary/xwzy.jpg",
          text: "虚无主义，从来都不是让人颓废的。",
        },
        {
          src: "https://music-960422.oss-cn-beijing.aliyuncs.com/diary/ml.jpg",
          text: "听会歌",
        },
        {
          src: "https://music-960422.oss-cn-beijing.aliyuncs.com/diary/sj.jpg",
          text: "未来既定，把握当下",
        },
      ],
      headerCanvas: null,
      diaryCanvas: null,
      navTouch: {
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    srcList() {
      return this.imgList.map((e) => e.src);
    },
  },
  watch: {
    active: {
      handler(i) {
        this.setBackPosition(i);
      },
    },
    // touch: {
    //   handler(v) {
    //     if (v && this.isMobile) {
    //       this.$notify({
    //         title: "提示来了~",
    //         message: "图片查看有点粗糙，勉强看看，以后再改~",
    //         duration: 1500,
    //       });
    //     }
    //   },
    // },
  },
  methods: {
    navclick(e, item, i) {
      this.active = i;
      if (i !== this.navlist.length - 1) {
        this.imgshow = false;
      }
      if (!item.hasPage) {
        if (this.isMobile) {
          this[item.event]([
            {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            },
            this.headerCanvas,
          ]);
        } else {
          this[item.event]([
            {
              x: e.clientX,
              y: e.clientY,
            },
            this.headerCanvas,
          ]);
        }
        return;
      }
      // this.$router.push(item.url);
    },
    // 设置字体跳动动画
    setBackPosition(i) {
      const note = this.navlist[i].note.split("").map((e, i) => {
        return `<span class='js-to-text-anm-${i}' style="animation-delay:${(
          i * 0.1
        ).toFixed(1)}s">${e}</span>`;
      });
      const subtitle = this.navlist[i].subtitle.split("").map((e, i) => {
        return `<span class='js-to-text-anm-${i}' style="animation-delay:${(
          i * 0.05 +
          note.length * 0.1
        ).toFixed(2)}s">${e}</span>`;
      });
      this.checkItem = null;
      this.$nextTick(() => {
        this.checkItem = {
          note: note.join(""),
          subtitle: this.isMobile
            ? subtitle.join("")
            : subtitle.reverse().join(""),
        };
      });

      let dom = this.$refs[`item-${i}`][0];
      if (!dom) return;
      let { clientWidth, offsetLeft } = dom;
      this.backLightLeft = offsetLeft + (clientWidth - 80) / 2;
    },
    // 创建 n 只萤火虫
    createFirefly([startp, canvas]) {
      if (this.creating || this.fireflylist.length >= 600) {
        return;
      }
      this.creating = true;
      let count = random(50, 100);
      let index = 0;
      let addFF = setInterval(() => {
        let firefly;
        if (this.isMobile) {
          firefly = new Firefly(
            startp,
            this.limitX,
            this.limitY,
            this.isMobile
          );
        } else {
          firefly = new Firefly(startp);
        }
        this.fireflylist.push(firefly);
        index++;
        if (index >= count) {
          this.creating = false;
          window.clearInterval(addFF);
        }
      }, 100);
      const ctx = canvas.getContext("2d");
      this.$emit("callBrotherEvent", { name: "removeAnm", params: this.anmId });
      const fun = (fireflys, ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let i = 0; i < fireflys.length; i++) {
          const ff = fireflys[i];
          // if (ff.flyStep === 2) {
          //   fireflys.splice(i, 1);
          // } else if (ff.flyStep === 1) {
          //   ff.light(ctx);
          // } else {
          //   ff.fly(ctx);
          // }
          if (ff.flyStep >= 1) {
            fireflys.splice(i, 1);
          } else {
            ff.fly(ctx);
          }
        }
      };
      let params = [this.fireflylist, ctx];
      let option = {
        id: this.anmId,
        name: "firefly",
        fun,
        params,
      };
      this.$emit("callBrotherEvent", { name: "addAnm", params: option });
    },
    // 随机创建涟漪
    createRipple() {
      const ctx = this.diaryCanvas.getContext("2d");
      const fun = (ripples, ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let has = this.active === 1 ? random(1, 200) < 6 : random(1, 200) < 3;
        if (has) {
          let num = random(2, 4);
          let x = random(0, this.diaryCanvas.width);
          let y = random(0, this.diaryCanvas.height);
          for (let i = 0; i < num; i++) {
            let delay = random(20, 30);
            let rip = new Ripple(x, y, this.diaryCanvas.height, i * delay);
            ripples.push(rip);
          }
        }
        ripples.forEach((e, i) => {
          e.draw(ctx);
          if (e.die) {
            ripples.splice(i, 1);
          }
        });
      };
      let params = [this.ripples, ctx];
      let option = {
        name: "ripple",
        fun,
        params,
      };
      this.$emit("callBrotherEvent", { name: "addAnm", params: option });
    },
    // 打开日记本
    openDiary() {
      this.imgshow = !this.imgshow;
      if (this.imgshow && !this.isMobile) {
        const h = this.$createElement;
        this.$notify({
          title: "提示来了~",
          message: h("i", "图片查看有点粗糙，勉强看看，以后再改~"),
          duration: 2000,
        });
      }
    },
    // 打开图片预览
    imgView(i) {
      let imgs = this.imgList.map((e) => {
        return e.src;
      });
      ImagePreview({
        images: imgs,
        startPosition: i,
      });
    },
    // navTouchStart
    navTouchStart(e) {
      this.navTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    navTouchMove(e) {
      let x = e.touches[0].clientX;
      if (this.navTouch.x - x > 50) {
        this.touch = false;
      }
    },
    openGithub() {
      window.open("https://github.com/xys2com/my-star");
    },
  },
  updated() {},
  mounted() {
    const { active: i, setBackPosition } = this;
    setTimeout(() => {
      setBackPosition(i);
    }, 1000);
    this.isMobile = mobileTypeJudge().isMobile;

    if (this.isMobile) {
      setTimeout(() => {
        this.headerCanvas = this.$refs["m-header-canvas"];
        this.diaryCanvas = this.$refs["m-diary-canvas"];
        this.headerCanvas.width = this.headerCanvas.parentNode.clientWidth * 2;
        this.headerCanvas.height =
          this.headerCanvas.parentNode.clientHeight * 2;
        this.diaryCanvas.width = this.diaryCanvas.parentNode.clientWidth * 2;
        this.diaryCanvas.height = this.diaryCanvas.parentNode.clientHeight * 2;
        this.limitX = this.headerCanvas.width;
        this.limitY = this.headerCanvas.height;
        this.createRipple();
      }, 1000);
    } else {
      this.headerCanvas = this.$refs["header-canvas"];

      this.headerCanvas.width = this.headerCanvas.parentNode.clientWidth;
      this.headerCanvas.height = this.headerCanvas.parentNode.clientHeight;
    }

    const pre_fn = window.onresize;
    window.onresize = () => {
      if (!this.tips) {
        const h = this.$createElement;
        this.$notify({
          title: "提示来了~",
          message: h("i", "没做响应式别看了~只做了移动端初始兼容。"),
          duration: 5000,
        });
        this.tips = true;
      }
      if (pre_fn) {
        pre_fn();
      }
    };
  },
};
</script>
<style lang="scss">
@import "styles/common.scss";
@font-face {
  font-family: "muyao";
  src: url("../assets/font/compress/Muyao-Softbrush.TTF") format("truetype");
}
@font-face {
  font-family: "fzlt";
  src: url("../assets/font/compress/FZZJ-XHLTJW.TTF") format("truetype");
}
@mixin lightFontBlue($color) {
  color: $color;
  text-shadow: 0px 0px 10px #426ab3, 0px 0px 10px #426ab3, 0px 0px 10px #426ab3,
    0px 0px 10px #426ab3;
}
@keyframes textShow {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes textShow2 {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  75% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.header-wrap {
  height: 80px;
  width: 100%;
  background: #00000099;
  position: absolute;
  top: 0;
  transition: all 0.3s;
  font-size: 18px;
  display: flex;
  align-items: center;
  padding: 0 50px;
  .header-canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
  .header-left {
    height: 100%;
    position: relative;
    width: 50%;
    display: flex;
    .active-nav-back {
      position: absolute;
      height: 80px;
      width: 80px;
      left: 7px;
      top: 0;
      background-image: radial-gradient(
        #fff0b880,
        #fff0b84c,
        #fff0b826,
        #8f876b13,
        #fff0b800,
        #fff0b800
      );
      transition: left 0.3s;
      transition-timing-function: ease;
      z-index: -1;
    }
    .item {
      font-family: "muyao";
      font-size: 24px;
      color: #fff0b8;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 30px;
      width: 100px;
      font-weight: bold;
      transition: all 0.5s;
      &:hover {
        @include lightFontBlue(#fff);
      }
      &.active {
        @include lightFontBlue(#fff);
      }
      &.github span {
        font-size: 40px;
      }
    }
  }
  .header-right {
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    font-family: "fzlt";
    div {
      text-align: left;
      height: 70%;
      display: flex;
      align-items: center;
      font-size: 24px;
      text-overflow: clip;
      overflow: hidden;
      width: 100%;
      @include lightFontBlue(#d6e5ff);
      span {
        opacity: 0;
        animation: textShow 0.2s;
        animation-fill-mode: forwards;
      }
    }
    p {
      width: 100%;
      margin: 0;
      text-align: right;
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      font-size: 18px;
      text-overflow: clip;
      overflow: hidden;
      @include lightFontBlue(#d6e5ff);
      span {
        opacity: 0;
        animation: textShow2 0.2s;
        animation-fill-mode: forwards;
      }
    }
  }
  .imglist {
    position: absolute;
    width: 94vw;
    left: 3vw;
    bottom: -70px;
    background: #0008;
    display: flex;
    flex-wrap: nowrap;
    padding: 0 30px;
    overflow-x: scroll;
    align-items: center;
    transition: all 0.5s;
    height: 0px;
    opacity: 0;
    &.show {
      height: 100px;
      opacity: 1;
      bottom: -120px;
    }
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 2px;
      box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      background: #535353;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      background: #0008;
    }
    .img-box {
      position: relative;
      margin-right: 10px;
      height: 80px;
      width: 80px;
      border: 1px solid #fff8;
      overflow: hidden;
      min-width: 80px;
      img {
        width: 80px;
      }
    }
  }
  z-index: 100;
}
.mobile-tips {
  font-family: "muyao";
  z-index: 99;
  height: px2rem(40px);
  width: 100%;
  background: #00000099;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  transition: all 0.3s;
  font-size: px2rem(22px);
  display: flex;
  align-items: center;
  padding: 0 px2rem(50px);
  @include lightFontBlue(#fff);
  animation: tipsHidden 1s ease 9s forwards;
}
@keyframes tipsHidden {
  0% {
    height: px2rem(40px);
    opacity: 1;
  }
  100% {
    height: 0;
    opacity: 0;
    display: none;
  }
}
.header-mobile {
  position: absolute;
  height: 100%;
  z-index: 100;
  .m-head {
    overflow: hidden;
    width: px2rem(60px);
    &.touch {
      img {
        width: px2rem(60px);
        margin: 0px;
      }
    }
    img {
      width: px2rem(40px);
      transition: all 0.2s;
      margin: 10px;
    }
  }
  .m-nav {
    position: absolute;
    height: 100%;
    top: 0;
    left: -100vw;
    width: 100vw;
    transition: left 0.5s;
    background: #0008;
    display: flex;
    &.active {
      left: 0;
    }
    .m-nav-main {
      width: 75vw;
      height: 100%;
      background: #000c;
      display: flex;
      flex-direction: column;
      .m-header-canvas {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
      }
      .m-nav-list {
        z-index: 2;
        width: 71vw;
        margin: 0 auto;
        height: px2rem(40px);
        border-bottom: 1px solid #426ab3;
        font-size: px2rem(20px);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        font-family: "muyao";
        .m-nav-item {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active {
            @include lightFontBlue(#fff);
          }
        }
      }
      .m-container {
        z-index: 2;
        height: 100%;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        &::after {
          content: "";
          position: absolute;
          display: block;
          height: 1px;
          width: 70vw;
          left: 2.5vw;
          bottom: 50%;
          background: #426ab3;
          box-shadow: 0px 0px 10px #426ab3, 0px 0px 10px #426ab3,
            0px 0px 10px #426ab3, 0px 0px 10px #426ab3;
        }
        .m-imglist {
          position: relative;
          height: 50%;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          padding: px2rem(10px) 0;
          overflow-y: scroll;
          align-items: flex-start;
          transition: all 0.5s;
          padding-top: px2rem(50px);
          .diary-title {
            top: px2rem(10px);
            left: 0;
            font-size: px2rem(20px);
            font-family: "muyao";
            @include lightFontBlue(#fff);
            height: px2rem(30px);
            position: absolute;
            width: 100%;
          }
          &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
          }
          &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 2px;
            box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
            background: #535353;
          }
          &::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            background: #0008;
          }
          .m-img-box {
            position: relative;
            margin-left: calc((75vw - 240px) / 3);
            margin-bottom: calc((75vw - 240px) / 3);
            height: 120px;
            width: 120px;
            border: 1px solid #fff8;
            overflow: hidden;
            min-width: 80px;
            img {
              width: 80px;
            }
          }
        }
        .m-diary {
          flex: 1;
          font-family: "fzlt";
          margin: 2vh 2.5vw;
          position: relative;
          .m-diary-canvas {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
          }
          .m-note {
            z-index: 1;
            position: relative;
            text-align: justify;
            text-align-last: left;
            min-height: 10vh;
            font-size: px2rem(24px);
            width: 100%;
            @include lightFontBlue(#d6e5ff);
            span {
              opacity: 0;
              animation: textShow 0.2s;
              animation-fill-mode: forwards;
            }
          }
          .m-subtitle {
            position: relative;
            margin: 0;
            text-align: justify;
            text-align-last: left;
            margin-top: 2vh;
            width: 100%;
            min-height: 8vh;
            font-size: px2rem(18px);
            @include lightFontBlue(#d6e5ff);
            span {
              opacity: 0;
              animation: textShow2 0.2s;
              animation-fill-mode: forwards;
            }
          }
          .m-other {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: px2rem(50px);
            display: flex;
            justify-content: space-around;
            align-items: center;
            span {
              font-size: 32px;
              @include lightFontBlue(#fff);
            }
          }
        }
      }
    }
    .m-nav-blank {
      width: 25vw;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 32px;
        @include lightFontBlue(#fff);
      }
    }
  }
}
</style>

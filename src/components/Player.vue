<template>
  <div
    :class="['square-player', isMobile ? 'in-mobile' : '']"
    ref="player"
    :style="`top:${playerConfig.top}px;left:${playerConfig.left}px`"
  >
    <div class="box-main">
      <div class="poster-atlas">
        <div
          title="按住拖动"
          :class="['drag', draging ? 'draging' : '']"
          @mousedown.prevent="getPlayerPos"
          @touchstart.prevent="getPlayerPos"
          @touchend.prevent="dragend"
          @mouseup.prevent="dragend"
        >
          <span class="iconfont icon-yidong_huaban"></span>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          content="点击切换"
          placement="right"
        >
          <div class="toggle-show" @click.stop="toggleShow">
            <span class="iconfont icon-qiehuan"></span>
          </div>
        </el-tooltip>
        <div
          :class="['poster-img', overturn === 0 ? 'recover' : 'overturn']"
        ></div>
        <div
          :class="['atlas-area', overturn !== 0 ? 'recover' : 'overturn']"
          id="atlas"
          :style="atlasBackgroundImage"
        ></div>
      </div>
      <div class="operate-area-wrap">
        <div class="operate-area">
          <div class="sm-btn-volume">
            <div class="small-btns">
              <div class="btn like">
                <span class="iconfont icon-like-fill"></span>
              </div>
              <div class="btn pre" @click.stop="prePlay">
                <span class="iconfont icon-left"></span>
              </div>
              <div class="btn next" @click.stop="nextPlay">
                <span class="iconfont icon-right"></span>
              </div>
            </div>
            <div class="volume-bar">
              <span
                @click="closeOpenVolume"
                :class="[
                  'iconfont',
                  !isMute ? 'icon-shengyin' : 'icon-shengyinguanbi',
                ]"
              ></span>
              <div class="bar-line" @click="setVolume">
                <div class="bar-line-inner" :style="`width:${volume}%`"></div>
              </div>
            </div>
          </div>
          <div class="big-btns" @click.stop="alterStatus">
            <div class="btn play" v-if="!playing">
              <span class="iconfont icon-play"></span>
            </div>
            <div class="btn pause" v-else>
              <span class="iconfont icon-suspend"></span>
            </div>
          </div>
        </div>

        <div class="play-infos">
          <div class="msc-infos">
            <p class="m-tit">
              {{ this.checkedMusic && this.checkedMusic.name }}
            </p>
            <p class="m-atr">作者: 无</p>
          </div>
          <div class="pgs">
            <div class="all-time">
              <span v-if="!mloading">{{ allTime }}</span>
              <div v-else class="read-time-loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="pgs-bar" @click="setPgs" ref="pgs-out-bar">
              <div class="pgs-inner-bar" :style="`width:${pgsValue}%`"></div>
            </div>
            <div class="now-time">{{ passedTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { musicList, custom } from "@/utils/api";
import { Sound } from "@/utils/sound";
import { random, mobileTypeJudge } from "@/utils/tool";
import { FrequencySpectrum } from "@/utils/music-view-anm";
import { mapGetters } from "vuex";
import html2canvas from "html2canvas";
export default {
  name: "App",
  computed: {
    ...mapGetters(["backgroundTopColor", "backgroundBottomColor"]),
  },
  watch: {
    volume: function (v) {
      if (v === 0) {
        this.isMute = true;
      } else {
        this.isMute = false;
      }
    },
  },
  props: {
    canvasId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 是否处于拖动状态
      draging: false,
      //
      overturn: 1,
      playerConfig: {
        height: 400,
        width: 320,
        top: 80,
        left: 20,
      },
      viewConfig: {
        height: 180,
        width: 280,
      },
      // 频谱图顶部颜色
      atlasTopColor: "",
      // 频谱图底部颜色
      atlasBottomColor: "",
      // 静音
      isMute: false,
      // 音量
      volume: 8,
      // 是否正在播放
      playing: false,
      // 进度条百分比
      pgsValue: 0,
      // 一个不加载出来的canvas
      VCanvasDom: null,
      // 定时器
      timer: null,
      // 音乐列表
      list: [],
      // 选中的音乐
      checkedMusic: null,
      // 音乐流数据
      musicData: null,
      // 正在播放中的id
      playingMusicId: null,
      // 计算进度条定时器
      setMusicPgsTimer: null,
      // 已经播放的时间
      passedTime: "00:00",
      // 歌曲总时间
      allTime: "00:00",
      // 加载歌曲
      mloading: false,
      // canvas主要区域
      canvasArea: null,
      // canvas变的图片数据
      canvasToPngUrl: "",
      // atlasBackgroundImage
      atlasBackgroundImage: "",
      // 图片更新定时器
      canvasDataUpdateTimer: null,
      // 点击的时间
      clickTimer: 0,
      // 当前播放时间
      playingTime: 0,
      // 完全准备完成
      allReady: false,
      // canvas 动画的id
      anmId: Math.random().toString(32).slice(-8),
      // 是否移动端
      isMobile: false,
      // 自动播放
      autoPlay: false,
      // 可视化对象
      visualObj: null,
      // 可视化动画是否启动
      visualAnmOnStarting: false,
    };
  },
  methods: {
    // 暂停启动
    alterStatus() {
      if (this.mloading) {
        this.$message.warning("歌曲加载中……");
        return;
      }
      if (this.playingMusicId === null) {
        this.getMusicFileStream();
      } else {
        this.playing = !this.playing;
        this.sound.playAndPause(this.playing);
      }
    },
    // 点击进度
    setPgs(e) {
      const allLan = this.$refs["pgs-out-bar"].clientWidth;
      this.pgsValue = ((e.offsetX / allLan) * 100).toFixed(2);
      const duration = parseInt(this.sound.duration - 1);
      this.playingTime = parseInt(duration * (e.offsetX / allLan));
      this.sound.dragAnalysisBufferPlay(this.playingTime);
    },
    // 获得起始位置
    getPlayerPos(e) {
      e.stopPropagation();
      this.draging = true;
      if (this.isMobile) {
        document.body.ontouchmove = (e) => {
          const p = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
          if (
            p.x > document.body.clientWidth ||
            p.x < 0 ||
            p.y > document.body.clientHeight ||
            p.y < 0
          ) {
            this.dragend();
          }
          this.setPlayerPos(p);
        };
      } else {
        document.body.onmousemove = (e) => {
          const p = {
            x: e.clientX,
            y: e.clientY,
          };
          this.setPlayerPos(p);
        };
      }
    },
    // 拖动位置
    setPlayerPos({ x, y }, init = false) {
      if (!this.draging && !init) {
        return;
      }
      this.playerConfig.left = x - 300;
      this.playerConfig.top = y - 15;
      if (this.playerConfig.left < 5) {
        this.playerConfig.left = 5;
      }
      if (this.playerConfig.top < 5) {
        this.playerConfig.top = 5;
      }
      if (this.playerConfig.left > document.body.clientWidth - 325) {
        this.playerConfig.left = document.body.clientWidth - 325;
      }
      if (this.playerConfig.top > document.body.clientHeight - 405) {
        this.playerConfig.top = document.body.clientHeight - 405;
      }
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        this.setAtlasBackground(
          this.playerConfig.left + 20,
          this.playerConfig.top + 20,
          this.playerConfig.left + 300,
          this.playerConfig.top + 200
        );
        window.clearTimeout(this.timer);
        this.timer = null;
      }, 5);
    },
    // 每20s更新一次背景颜色数据
    updateBackgroundBase64() {
      if (this.isMobile) {
        return;
      }
      if (!this.canvasArea) {
        this.canvasArea = document.getElementById(this.canvasId);
      }
      html2canvas(this.canvasArea).then((c) => {
        const pre_ = this.canvasToPngUrl;
        const data_ = c.toDataURL("image/png");
        let c2 = document.createElement("canvas");
        c2.width = document.body.clientWidth;
        c2.height = document.body.clientHeight;
        let ctx = c2.getContext("2d");
        let img = new Image();
        img.src = data_;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, c2.width, c2.height);
          // this.$emit("staroverturnrender", c2);
          this.canvasToPngUrl = c2.toDataURL("image/png");
          if (pre_ === "") {
            this.setAtlasBackground(
              this.playerConfig.left + 20,
              this.playerConfig.top + 20,
              this.playerConfig.left + 300,
              this.playerConfig.top + 200
            );
          }
        };
      });
      // this.canvasDataUpdateTimer = setTimeout(() => {
      //   this.updateBackgroundBase64();
      // }, 30000);
    },
    // 设置频谱背景色
    setAtlasBackground(x1, y1, x2, y2) {
      const cvs = document.createElement("canvas");
      cvs.width = x2 - x1;
      cvs.height = y2 - y1;
      const ctx = cvs.getContext("2d");
      // 把图片放到当前新的canvas里面
      let img = new Image();
      img.src = this.canvasToPngUrl;

      img.onload = () => {
        let imgW = x2 - x1;
        let imgH = y2 - y1;
        // 截取 坐标点的图片
        ctx.drawImage(img, x1, y1, imgW, imgH, 0, 0, imgW, imgH);
        // ctx.drawImage(img, 0, 0, imgW, imgH);
        // 转换成base64
        const base64url = cvs.toDataURL("image/png");
        // 设置为频谱的背景色，伪装成透明
        this.atlasBackgroundImage = `background: url(${base64url});`;
      };
    },
    // 拖动完成
    dragend() {
      this.draging = false;
      document.body.onmousemove = null;
    },
    // 设置canvas方法
    setCanvasGetPixColorFn() {
      /* eslint-disable */
      ((HTMLElement) => {
        if (typeof HTMLElement == "undefined") {
          var HTMLElement = function () {};
          if (window.webkit) document.createElement("iframe"); //fixes safari
          HTMLElement.prototype = window.webkit
            ? window["[[DOMElement.prototype]]"]
            : {};
        }
        HTMLElement.prototype.getPixelColor = function (x, y) {
          var thisContext = this.getContext("2d");
          var imageData = thisContext.getImageData(x, y, 1, 1);
          // 获取该点像素数据
          var pixel = imageData.data;
          var r = pixel[0];
          var g = pixel[1];
          var b = pixel[2];
          var a = pixel[3] / 255;
          a = Math.round(a * 100) / 100;
          var rHex = r.toString(16);
          r < 16 && (rHex = "0" + rHex);
          var gHex = g.toString(16);
          g < 16 && (gHex = "0" + gHex);
          var bHex = b.toString(16);
          b < 16 && (bHex = "0" + bHex);
          var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
          var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
          var hexColor = "#" + rHex + gHex + bHex;
          return {
            rgba: rgbaColor,
            rgb: rgbColor,
            hex: hexColor,
            r: r,
            g: g,
            b: b,
            a: a,
          };
        };
      })(HTMLElement);
      /* eslint-enable */
    },
    // 播放上一首
    prePlay() {
      if (!this.playing) {
        this.alterStatus();
        return;
      }
      let index =
        this.list.findIndex((e) => {
          return e.id === this.playingMusicId;
        }) - 1;
      if (index < 0) {
        index = this.list.length - 1;
      }
      this.checkedMusic = this.list[index];
      this.getMusicFileStream();
    },
    // 播放下一首
    nextPlay() {
      if (!this.playing) {
        this.alterStatus();
        return;
      }
      let index =
        this.list.findIndex((e) => {
          return e.id === this.playingMusicId;
        }) + 1;
      if (index >= this.list.length) {
        index = 0;
      }
      this.checkedMusic = this.list[index];
      this.getMusicFileStream();
    },
    // 获得音乐列表
    async getMusicList() {
      const res = await musicList();
      if (res.success) {
        this.list = res.data;
        this.checkedMusic = this.list[random(0, this.list.length - 1)];
        this.getMusicFileStream();
        if (this.autoPlay) this.alterStatus();
      } else {
        this.$message.error(res.message || "接口错误");
      }
    },
    // 获得音乐文件流
    async getMusicFileStream() {
      this.mloading = true;
      if (this.setMusicPgsTimer) {
        window.clearInterval(this.setMusicPgsTimer);
        this.setMusicPgsTimer = null;
      }
      const url = `/videos/${this.checkedMusic.id}.${this.checkedMusic.type}`;
      const res = await custom(url);
      if (res.status === 200) {
        this.sound.init();
        this.sound.analysisBufferPlay(
          res.data,
          this.playingMusicId === null ? true : false,
          () => {
            // 所有东西准备完成的工作完成的回调
            this.calcSchedule();
            this.setAnm();
          },
          () => {
            // 播放完成后的回调
          }
        );
        this.sound.setVolume(this.volume / 100);
        if (this.playingMusicId !== null) {
          this.playing = true;
        }
        this.playingMusicId = this.checkedMusic.id;
      } else {
        this.$message.error(res.message || "接口错误");
      }
    },
    // 静音或者打开音量
    closeOpenVolume() {
      this.volume > 0 ? (this.volume = 0) : (this.volume = 10);
      this.sound.setVolume(this.volume / 100);
    },
    // 修改音量
    setVolume(e) {
      let vl = e.offsetX / 150;
      if (vl < 0.05) {
        vl = 0;
      }
      if (vl > 0.95) {
        vl = 1;
      }
      this.volume = Number((vl * 100).toFixed(2));
      this.sound.setVolume(Number(vl.toFixed(2)));
    },
    // 计算歌曲播放进度
    calcSchedule() {
      this.playingTime = 0;
      if (this.setMusicPgsTimer) {
        window.clearInterval(this.setMusicPgsTimer);
        this.setMusicPgsTimer = null;
      }
      const fun = () => {
        const duration = parseInt(this.sound.duration);
        this.pgsValue = (this.playingTime / duration) * 100;
        this.passedTime = this.secondToMinuteFn(this.playingTime);
        this.allTime = this.secondToMinuteFn(duration);
        if (duration && !isNaN(duration)) {
          this.mloading = false;
        }
        if (this.playing) {
          this.playingTime++;
        }
        if (this.playingTime >= duration) {
          this.pgsValue = 0;
          this.nextPlay();
        }
      };
      fun();
      this.setMusicPgsTimer = setInterval(fun, 1000);
    },
    // 把方法及方法参数传递给父组件统一的动画执行程序里
    setAnm() {
      if (this.visualObj === null) {
        this.visualObj = new FrequencySpectrum("atlas");
      }
      let index = 0;
      if (this.overturn > 0) {
        index = this.overturn - 1;
      } else {
        index = this.overturn;
      }
      this.visualObj.runIndex = index;
      if (!this.visualAnmOnStarting) {
        this.$emit("removeAnm", this.anmId);
        const fun = (obj) => {
          let sizeData = this.sound.visualizer();
          obj.drawAnmByName(sizeData);
        };
        const params = [this.visualObj];
        const option = {
          id: this.anmId,
          fun,
          params,
        };
        this.$emit("add", option);
        this.visualAnmOnStarting = true;
      }
    },
    // 秒转分
    secondToMinuteFn(s) {
      let mstr =
        parseInt(s / 60) < 10 ? `0${parseInt(s / 60)}` : parseInt(s / 60);
      let sstr =
        parseInt(s % 60) < 10 ? `0${parseInt(s % 60)}` : parseInt(s % 60);
      return `${mstr}:${sstr}`;
    },
    // 切换显示
    toggleShow() {
      if (this.isMobile) {
        this.overturn++;
        if (this.overturn > 2) {
          this.overturn = 1;
        }
        this.setAnm();
        return;
      }
      this.overturn++;
      if (this.overturn > 3) this.overturn = 0;
      if (this.overturn > 0) {
        this.setAnm();
      }
    },
    // 初始化播放器位置
    initPlayer() {
      let sc_w = document.body.clientWidth;
      let sc_h = document.body.clientHeight;
      // 计算拖动按钮的中心位置
      let posX = (sc_w - this.playerConfig.width) / 2 + 300,
        posY = (sc_h - this.playerConfig.height) / 2 + 15;
      this.setPlayerPos({ x: posX, y: posY }, true);
    },
  },
  mounted() {
    // 设置canvas 宽度
    this.VCanvasDom = document.createElement("canvas");
    this.VCanvasDom.width = document.body.clientWidth;
    this.VCanvasDom.height = document.body.clientHeight;
    document.body.onresize = () => {
      this.VCanvasDom.width = document.body.clientWidth;
      this.VCanvasDom.height = document.body.clientHeight;
    };
    this.initPlayer();
    // 更新背景
    // this.updateBackgroundBase64();
    // 注册事件
    document.body.onmouseleave = () => {
      this.dragend();
    };
    // 注册canvas原型方法
    this.setCanvasGetPixColorFn();
    // 初始化sound对象
    this.sound = new Sound();
    // 获得歌曲列表
    this.getMusicList();
    // 是否移动端
    this.isMobile = mobileTypeJudge().isMobile;
    if (this.isMobile) {
      this.playerConfig = {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        top: 0,
        left: 0,
      };
    }
  },
  destroyed() {
    document.body.onresize = null;
    document.body.onmouseleave = null;
    window.clearInterval(this.setMusicPgsTimer);
    window.clearTimeout(this.canvasDataUpdateTimer);
    this.dragend();
  },
};
</script>
<style lang="scss" scoped>
@import "styles/common.scss";
.square-player {
  position: absolute;
  &.in-mobile {
    position: relative;
    height: 100%;
    width: 100%;
    .box-main {
      height: 100%;
      width: 100%;
      box-shadow: unset;
      border-radius: 0;
      padding: px2rem(20px);
      background: unset;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .poster-atlas {
        position: relative;
        border-radius: px2rem(15px);
        margin-top: px2rem(-75px);
        height: 250px;
        width: 100%;
        z-index: 0;
        .drag {
          display: none;
        }
        .toggle-show {
          position: absolute;
          right: px2rem(-15px);
          bottom: px2rem(75px);
          width: px2rem(30px);
          height: px2rem(30px);
          border-radius: px2rem(15px);
          box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
        }
        .poster-img {
          border-radius: px2rem(15px);
          &::before {
            top: px2rem(30px);
            border-radius: px2rem(15px);
          }
        }
        .atlas-area {
          border-radius: px2rem(5px);
          height: calc(100% - px2rem(5px));
        }
      }

      .operate-area {
        margin-top: px2rem(10px);
        .sm-btn-volume {
          .small-btns {
            height: px2rem(48px);
            .btn {
              width: px2rem(48px);
              height: px2rem(48px);
              // border-radius: px2rem(24px);
              border-radius: px2rem(24px);
              border: px2rem(3px) solid #3eb2ff;
              background: unset;
              span {
                font-size: px2rem(32px);
                color: #3eb2ff;
              }
              &::before {
                display: none;
              }
              &:hover {
                span {
                  color: #fff;
                }
              }
            }
          }
          .volume-bar {
            height: px2rem(24px);
            span {
              color: #3eb2ff;
              font-size: px2rem(20px);
            }
            .bar-line {
              background: #3eb2ff33;
              width: px2rem(150px);
              .bar-line-inner {
                background: #3eb2ff;
              }
            }
          }
        }
        .big-btns {
          height: px2rem(72px);
          .btn {
            color: #3eb2ff;
            width: px2rem(60px);
            height: px2rem(60px);
            border-radius: px2rem(30px);
            border: px2rem(4px) solid #3eb2ff;
            span {
              color: #3eb2ff;
              font-size: px2rem(48px);
            }
            &:hover {
              span {
                color: #fff;
              }
            }
          }
        }
      }

      .play-infos {
        .msc-infos {
          .m-tit {
            color: #fff;
            font-size: px2rem(18px);
            font-weight: bold;
          }
          .m-atr {
            color: #fff8;
            font-size: px2rem(18px);
          }
        }
        .pgs {
          .all-time {
            font-size: px2rem(20px);
            height: px2rem(30px);
            color: #fff;
            opacity: 1;
            .read-time-loading {
              height: px2rem(30px);
              width: px2rem(30px);
              span {
                background-color: #fff;
                width: px2rem(5px);
                height: px2rem(5px);
                border-radius: px2rem(2.5px);
              }
              @keyframes loadinganm {
                0%,
                100% {
                  transform: translateY(px2rem(-7.5px));
                }

                44% {
                  transform: translateY(px2rem(7.5px));
                }
              }
            }
          }
          .pgs-bar {
            height: px2rem(5px);
            border-radius: px2rem(2.5px);
            background: #3eb2ff33;
            .pgs-inner-bar {
              background: #3eb2ff;
              border-radius: px2rem(2.5px);
            }
          }
          .now-time {
            color: #fff;
            height: px2rem(5px);
            font-size: px2rem(16px);
          }
        }
      }
    }
  }
  .box-main {
    height: 400px;
    width: 320px;
    box-shadow: 0px 15px 35px -5px rgba(50, 88, 130, 0.32);
    background: #eef3f7;
    border-radius: 15px;
    padding: 20px;
    // opacity: 0.9;
    // transition: opacity 0.3s;
    // &:hover {
    //   opacity: 1;
    // }
    .poster-atlas {
      position: relative;
      border-radius: 15px;
      margin-top: -75px;
      height: 250px;
      width: 100%;
      z-index: 0;
      .drag {
        position: absolute;
        right: -15px;
        bottom: 165px;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #fff;
        box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
        @include flex-al-center;
        @include flex-jus-center;
        cursor: pointer;
        transform: scale(0.8);
        transition: transform 0.5s;
        z-index: 5;
        &.draging {
          transform: scale(1.2);
        }
        &:hover {
          // transform: scale(1);
          span {
            color: #532ab9;
          }
        }
        span {
          transition: color 0.3s;
          font-size: 16px;
          color: #acb8cc;
        }
      }
      .toggle-show {
        position: absolute;
        right: -15px;
        bottom: 75px;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #fff;
        box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
        @include flex-al-center;
        @include flex-jus-center;
        cursor: pointer;
        transform: scale(0.8);
        transition: all 0.5s;
        z-index: 5;
        // &.poster_in {
        //   background-color: #0a0f3a;
        //   span {
        //     color: #fff;
        //   }
        // }
        &:hover {
          // transform: scale(1);
          span {
            color: #532ab9;
          }
        }
        span {
          transition: color 0.3s;
          font-size: 16px;
          color: #acb8cc;
        }
      }
      .poster-img {
        position: relative;
        border-radius: 15px;
        background-image: linear-gradient(45deg, #ff0, #0ff);
        height: 100%;
        width: 100%;
        transition: transform ease-in 0.3s;
        &.overturn {
          // transform: rotateY(180deg);
          animation: overturnAnm 0.5s;
          animation-fill-mode: forwards;
          backface-visibility: hidden;
          z-index: 2;
        }
        &.recover {
          animation: recoverAnm 0.5s;
          animation-fill-mode: forwards;
          z-index: 1;
        }
        &::after {
          content: "";
          background: inherit;
          width: 100%;
          height: 100%;
          box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
          display: block;
          z-index: 2;
          position: absolute;
          border-radius: 15px;
        }
        &::before {
          content: "";
          background: inherit;
          width: 100%;
          height: 100%;
          box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.5);
          display: block;
          z-index: 1;
          position: absolute;
          top: 30px;
          transform: scale(0.9);
          filter: blur(10px);
          opacity: 0.9;
          border-radius: 15px;
        }
      }
      .atlas-area {
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 5px;
        height: calc(100% - 70px);
        width: 100%;
        transition: transform ease-in 0.3s;
        &.overturn {
          // transform: rotateY(180deg);
          animation: overturnAnm 0.5s;
          animation-fill-mode: forwards;
          backface-visibility: hidden;
          z-index: 2;
        }
        &.recover {
          animation: recoverAnm 0.5s;
          animation-fill-mode: forwards;
          z-index: 1;
        }
      }
      @keyframes overturnAnm {
        20% {
          transform: scale(1.1);
          opacity: 0.2;
        }
        100% {
          transform: rotateX(180deg) scale(1.1);
          opacity: 0;
        }
      }
      @keyframes recoverAnm {
        80% {
          transform: rotateX(0deg) scale(1.1);
          opacity: 0.8;
        }
        100% {
          transform: scale(1) rotateX(0deg);
          opacity: 1;
        }
      }
    }

    .operate-area {
      margin-top: 10px;
      @include flex-jus-between;
      align-items: flex-start;
      .sm-btn-volume {
        width: 70%;
        .small-btns {
          @include flex-jus-around;
          @include flex-al-center;
          height: 48px;
          cursor: pointer;
          .btn {
            @include flex-al-center;
            @include flex-jus-center;
            transition: all 0.5s;
            width: 48px;
            height: 48px;
            border-radius: 24px;
            position: relative;
            transition: all 0.4s;
            span {
              z-index: 10;
              color: #acb8cc;
              font-size: 32px;
              transition: color 0.3s;
            }
            &:hover {
              &::before {
                opacity: 1;
                transform: scale(1);
              }
              span {
                color: #532ab9;
              }
            }
            &::before {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 24px;
              background: #fff;
              z-index: 0;
              box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
              transform: scale(0.9);
              transition: transform 0.15s;
            }
          }
        }
        .volume-bar {
          width: 100%;
          height: 24px;
          padding: 0 5%;
          @include flex-al-center;
          span {
            color: #acb8cc;
            font-weight: bold;
            cursor: pointer;
            font-size: 20px;
          }
          .bar-line {
            width: 150px;
            height: 5px;
            border-radius: 2.5px;
            background: #d0d8e6;
            cursor: pointer;
            margin-left: 5%;
            .bar-line-inner {
              border-radius: 2.5px;
              background: #a3b3ce;
              height: 100%;
              transition: width 0.5s;
            }
          }
        }
      }
      .big-btns {
        flex: 1;
        height: 72px;
        @include flex-jus-center;
        @include flex-al-center;
        cursor: pointer;
        .btn {
          color: #fff;
          width: 60px;
          height: 60px;
          border: 6px solid #fff;
          transition: all 0.5s;
          filter: drop-shadow(0 11px 6px rgba(172, 184, 204, 0.45));
          @include flex-jus-center;
          @include flex-al-center;
          border-radius: 30px;
          span {
            font-size: 48px;
            color: #fff;
            transition: color 0.3s;
          }
          &:hover {
            span {
              color: #532ab9;
            }
          }
        }
      }
    }

    .play-infos {
      .msc-infos {
        p {
          margin: 0;
          color: #71829e;
          text-align: left;
        }
        .m-tit {
          font-size: 18px;
          font-weight: bold;
        }
        .m-atr {
          font-size: 18px;
        }
      }
      .pgs {
        color: #71829e;
        font-family: Helvetica Arial;
        .all-time {
          position: relative;
          text-align: right;
          font-weight: 700;
          font-size: 20px;
          opacity: 0.5;
          height: 30px;
          .read-time-loading {
            position: absolute;
            height: 30px;
            width: 30px;
            top: 0;
            right: 0;
            display: flex;
            @include flex-al-center;
            @include flex-jus-around;
            span {
              background-color: #532ab9;
              width: 5px;
              height: 5px;
              border-radius: 2.5px;
              animation: loadinganm 1.2s ease-in-out infinite;
            }
            span:nth-child(2) {
              animation-delay: -0.2s;
            }
            span:nth-child(3) {
              animation-delay: -0.4s;
            }

            @keyframes loadinganm {
              0%,
              100% {
                transform: translateY(-7.5px);
              }

              44% {
                transform: translateY(7.5px);
              }
            }
          }
        }
        .pgs-bar {
          height: 5px;
          border-radius: 2.5px;
          width: 100%;
          background: #d0d8e6;
          cursor: pointer;
          .pgs-inner-bar {
            border-radius: 2.5px;
            background: #a3b3ce;
            height: 100%;
            transition: width 0.2s;
          }
        }
        .now-time {
          margin-top: 5px;
          color: #71829e;
          font-weight: 700;
          font-size: 16px;
          opacity: 0.7;
          text-align: left;
        }
      }
    }
  }
}
</style>

<template>
  <div class="view-list musicbox">
    <div class="musiclist">
      <ul id="musics">
        <li
          :class="playingid === e.id ? 'play' : ''"
          v-for="(e, i) in list"
          :key="i"
          @click="getFileUrl(e.id)"
        >
          {{ e.name }}
        </li>
      </ul>
      <div class="control">
        <div class="volume">
          <!-- 音量控制 -->
          <el-slider v-model="volume" :debounce="300" @change="changeVolume" />
          <!-- <div class="vol-block" id="vol-block">
            <div class="vol-val" id="vol-val" val="50"></div>
            <div class="slide-block" id="slide-block">
              <div class="tips" id="tips">50</div>
            </div>
          </div> -->
        </div>
        <div class="buttons">
          <div class="btn" @click="prePlay">
            <img src="@/assets/images/prev.png" />
          </div>
          <div class="btn" @click="play">
            <img
              :src="
                playing
                  ? require('@/assets/images/pause.png')
                  : require('@/assets/images/play.png')
              "
            />
          </div>
          <div class="btn" @click="nextPlay">
            <img src="@/assets/images/next.png" />
          </div>
        </div>
      </div>
    </div>
    <progress-bar
      :progressValue.sync="progressValue"
      @setMusicProgress="setMusicProgress"
    />
  </div>
</template>
<script>
import { musicList, musicDetail, custom } from "@/utils/api";
import progress from "@/components/Progress.vue";
import { Sound } from "@/utils/sound";
import { random } from "@/utils/tool";
export default {
  components: {
    "progress-bar": progress,
  },
  data() {
    return {
      list: [],
      sound: null,
      playingid: null,
      volume: 10,
      playing: false,
      progressValue: 0,
    };
  },
  methods: {
    async getMusicList() {
      const res = await musicList();
      if (res.success) {
        this.list = res.data;
      } else {
        this.$message.error(res.message || "接口错误");
      }
    },
    // 获得音频文件在本地的路径
    async getFileUrl(id) {
      const res = await musicDetail({ id });
      this.playingid = id;
      if (res.success) {
        this.getFileStream(res.data);
      } else {
        this.$message.error(res.message || "接口错误");
      }
    },
    // 请求本地音频文件 返回文件流
    async getFileStream(url) {
      const res = await custom(url);
      if (res.status === 200) {
        this.playing = true;
        this.sound.analysisBufferPlay(res.data, () => {
          this.nextPlay();
        });
        // this.sound.visualizer(stream => {}); // 返回256 长度的 音频数组
        this.sound.visualizer();
        this.calcSchedule();
      } else {
        this.$message.error(res.message || "接口错误");
      }
    },
    // 修改音量
    changeVolume(v = 10) {
      this.sound.setVolume(v / 100);
    },
    // 播放上一首
    prePlay() {
      let index =
        this.list.findIndex((e) => {
          return e.id === this.playingid;
        }) - 1;
      if (index < 0) {
        index = this.list.length - 1;
      }
      this.getFileUrl(this.list[index].id);
    },
    // 播放下一首
    nextPlay() {
      let index =
        this.list.findIndex((e) => {
          return e.id === this.playingid;
        }) + 1;
      if (index >= this.list.length) {
        index = 0;
      }
      this.getFileUrl(this.list[index].id);
    },
    // 播放
    play() {
      if (this.playingid === null) {
        this.randomPlay();
      } else {
        this.playing = !this.playing;
        this.sound.playAndPause(this.playing);
      }
    },
    // 随机播放
    randomPlay() {
      const id = this.list[random(0, this.list.length - 1)].id;
      this.getFileUrl(id);
    },
    // 设置歌曲进度 返回百分比
    setMusicProgress(val) {
      console.log(val);
      this.sound.AC.currentTime = Number(val);
    },
    // 计算歌曲播放进度
    calcSchedule() {
      const fun = () => {
        const currentTime = this.sound.AC.currentTime;
        const duration = this.sound.duration;
        this.progressValue = (currentTime / duration) * 100;
      };
      const option = {
        fun,
      };
      this.$emit("add", option);
    },
  },
  mounted() {
    this.sound = new Sound();
    this.sound.init();
    this.changeVolume();
    this.getMusicList();
  },
};
</script>
<style lang="scss" scoped>
.musicbox {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .musiclist {
    margin: 20px;
    position: relative;
    height: 60%;
    width: 200px;
    // box-shadow: 0px 3px 3px rgba(255, 239, 180, 0.125),
    //   0px -3px 3px rgba(255, 239, 180, 0.125),
    //   3px 0px 3px rgba(255, 239, 180, 0.125),
    //   -3px 0px 3px rgba(255, 239, 180, 0.125);
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0.2;
    transition: opacity 0.5s;
    &:hover {
      opacity: 0.75;
    }
    ul {
      position: relative;
      height: 60%;
      width: 100%;
      padding: 5px 10px;
      overflow-y: scroll;
      // box-shadow: 0 2px 2px rgba(255, 255, 255, 0.4);
      &::-webkit-scrollbar {
        /**/
        border-radius: 5px;
        overflow: hidden;
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 1px;
        background: rgba(255, 255, 255, 0.2);
      }
      &::-webkit-scrollbar-track {
        border-radius: 1px;
      }
      li {
        height: 30px;
        line-height: 28px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
        // border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
        cursor: pointer;
        padding-left: 20px;
        transition: all 0.2s;
        font-size: 14px;
        &:hover {
          text-shadow: 0px 5px 5px rgba(255, 255, 255, 0.6),
            0px -5px 5px rgba(255, 255, 255, 0.6),
            5px 0px 5px rgba(255, 255, 255, 0.6),
            -5px 0px 5px rgba(255, 255, 255, 0.6);
          font-size: 16px;
        }
        &:first-child {
          // border-top: 0.5px solid rgba(255, 255, 255, 0.4);
        }
        &.play {
          color: #fff;
          font-size: 16px;
          text-shadow: 0px 4px 5px rgb(44, 128, 253),
            0px -4px 5px rgb(44, 128, 253), 5px 0px 6px rgb(44, 128, 253),
            -5px 0px 6px rgb(44, 128, 253);
          // box-shadow: 0px 0px 2px rgb(90, 153, 248),
          //   0px -0px 2px rgb(90, 153, 248), 0px 0px 2px rgb(90, 153, 248),
          //   -0px 0px 2px rgb(90, 153, 248);
        }
      }
    }

    .control {
      position: absolute;
      min-height: 100px;
      border-radius: 5px;
      width: 90%;
      left: 5%;
      bottom: 10px;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0px 3px 3px rgba(255, 255, 255, 0.2),
        0px -3px 3px rgba(255, 255, 255, 0.2),
        3px 0px 3px rgba(255, 255, 255, 0.2),
        -3px 0px 3px rgba(255, 255, 255, 0.2);

      .volume {
        position: relative;
        height: 30px;
        width: 160px;
        margin: 5px auto;
        v-deep.el-tooltip.el-slider__button {
          cursor: pointer;
        }
        v-deep.el-slider__runway {
          box-shadow: 0px 3px 3px rgba(0, 153, 255, 0.2),
            0px -3px 3px rgba(0, 153, 255, 0.2),
            3px 0px 3px rgba(0, 153, 255, 0.2),
            -3px 0px 3px rgba(0, 153, 255, 0.2);
        }
        .vol-block {
          position: relative;
          height: 4px;
          width: 100%;
          background: #fff;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 0px 3px 3px rgba(255, 255, 255, 0.2),
            0px -3px 3px rgba(255, 255, 255, 0.2),
            3px 0px 3px rgba(255, 255, 255, 0.2),
            -3px 0px 3px rgba(255, 255, 255, 0.2);
        }
        .vol-val {
          position: relative;
          height: 4px;
          width: 50%;
          background: #0099ff;
          border-radius: 3px;
          box-shadow: 0px 3px 3px rgba(0, 153, 255, 0.5),
            0px -3px 3px rgba(0, 153, 255, 0.5),
            3px 0px 3px rgba(0, 153, 255, 0.5),
            -3px 0px 3px rgba(0, 153, 255, 0.5);
        }
        .slide-block {
          position: absolute;
          height: 15px;
          width: 15px;
          border-radius: 7.5px;
          left: calc(50% - 7.5px);
          top: -5.5px;
          background: #0099ff;
          cursor: pointer;
          box-shadow: 0px 3px 3px rgba(255, 255, 255, 0.2),
            0px -3px 3px rgba(255, 255, 255, 0.2),
            3px 0px 3px rgba(255, 255, 255, 0.2),
            -3px 0px 3px rgba(255, 255, 255, 0.2);
          .tips {
            height: 20px;
            width: 25px;
            border: 0.5px solid #888;
            background: rgba(255, 255, 255, 0.4);
            position: absolute;
            top: -25px;
            left: -5px;
            border-radius: 3px;
            text-align: center;
            font-size: 12px;
            line-height: 20px;
            color: #ddd;
            display: none;
            &::after {
              content: "";
              display: block;
              width: 0;
              height: 0;
              border-width: 5px 5px 0;
              border-style: solid;
              border-color: rgba(255, 255, 255, 0.4) transparent transparent;
              left: 7.5px;
              bottom: -5px;
              position: absolute;
            }
          }
        }
      }

      .buttons {
        position: relative;
        height: 60px;
        width: 160;
        margin: 5px auto;
        padding: 10px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .btn {
          position: relative;
          height: 40px;
          width: 40px;
          cursor: pointer;
          overflow: visible;
          img {
            position: absolute;
            height: 150%;
            width: 150%;
            left: -10px;
            top: -10px;
          }
        }
      }
    }
  }
}
</style>

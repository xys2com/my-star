<template>
  <div class="other-anm">
    <!-- 点对点 曲线 -->
    <el-row class="bd-bt">
      <p>原生js canvas 曲线动画</p>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="bd-rt">
        <canvas ref="cvs1" width="400" height="400"></canvas>
        <el-row>
          <el-col :span="2"> p1: </el-col>
          <el-col :span="11">
            <el-input placeholder="x" v-model="p1.x"
          /></el-col>
          <el-col :span="11">
            <el-input placeholder="y" v-model="p1.y"
          /></el-col>
        </el-row>
        <el-row>
          <el-col :span="2"> p2: </el-col>
          <el-col :span="11">
            <el-input placeholder="x" v-model="p2.x"
          /></el-col>
          <el-col :span="11">
            <el-input placeholder="y" v-model="p2.y"
          /></el-col>
        </el-row>
        <el-row>
          <el-button type="primary" size="mini" @click="mod">生成</el-button>
          <el-button type="primary" size="mini" @click="modadd">加入</el-button>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <canvas ref="cvs1_2" width="400" height="400"></canvas>
        <el-button type="primary" size="mini" @click="mod2">生成</el-button>
      </el-col>
    </el-row>
    <!-- 小球动画 -->
    <el-row class="bd-bt">
      <p>原生js canvas 小球移动</p>
      <canvas ref="cvs2" width="300" height="300"></canvas><br />
      <el-button type="primary" size="mini" @click="ball">生成</el-button>
      <el-button type="primary" size="mini" @click="link">连线</el-button>
      <el-button type="primary" size="mini" @click="to3d">立体感</el-button>
    </el-row>
    <!-- 弧线动画 -->
    <el-row class="bd-bt">
      <p>原生js canvas 弧线旋转</p>
      <canvas ref="cvs3" width="300" height="300"></canvas><br />
      <el-button type="primary" size="mini" @click="arc">生成</el-button>
    </el-row>
    <!-- 宇宙星空 -->
    <!-- <el-row>
      <canvas ref="cvs4" width="300" height="300"></canvas>
      <el-button type="primary" size="mini" @click="uni">生成</el-button>
    </el-row> -->
    <!-- 其他动画 -->
    <el-row>
      <p>其他原生js canvas 绘制动画 图示</p>
      <div class="gif-list">
        <div class="gif-item" v-for="(item, i) in gifs" :key="i">
          <img :src="item.url" alt="" srcset="" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import {
  Bezier,
  Ring,
  random,
  Bezier2,
  Movedot,
  link,
  RotateArc,
} from "@/utils/other-anm";
export default {
  name: "Other",
  data() {
    return {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 },
      lines: [],
      lines2: [],
      lineData: [
        {
          p1: { x: 100, y: 300 },
          p2: { x: 300, y: 250 },
        },
        {
          p1: { x: 0, y: 100 },
          p2: { x: 350, y: 160 },
        },
        {
          p1: { x: 200, y: 200 },
          p2: { x: 350, y: 300 },
        },
      ],
      rings: [],
      dots: [],
      links: false,
      d3: true,
      dotdatas: ["#d18f52", "#c162de", "#42b3c2", "#98c379", "#61afef"],
      ra: null,
      anm: null,
      allAnmFnOptions: [],
      canvasIds: [
        Math.random().toString(32).slice(-8),
        Math.random().toString(32).slice(-8),
        Math.random().toString(32).slice(-8),
        Math.random().toString(32).slice(-8),
      ],
      gifs: [
        {
          name: "粒子1",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas1.gif",
        },
        {
          name: "粒子2",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas2.gif",
        },
        {
          name: "粒子3",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas3.gif",
        },
        {
          name: "小球",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas4.gif",
        },
        {
          name: "路径动画1",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas5.gif",
        },
        {
          name: "路径动画2",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas6.gif",
        },
        {
          name: "浮光",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas7.gif",
        },
        {
          name: "画心",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas8.gif",
        },
        {
          name: "波纹",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas9.gif",
        },
        {
          name: "贪吃蛇",
          url: "https://music-960422.oss-cn-beijing.aliyuncs.com/canvas-gif/canvas10.gif",
        },
      ],
    };
  },
  watch: {
    allAnmFnOptions: "hasTasks",
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
        return e.id === id;
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
    mod() {
      const data = this.lineData;
      this.lines = [];
      this.rings = [];
      let ctx = this.$refs.cvs1.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      data.forEach((e) => {
        let b = new Bezier(e.p1, e.p2);
        this.lines.push(b);
        let count = 3;
        for (let j = 0; j < count; j++) {
          let ring = new Ring(900 + j * random(500, 800));
          ring.init(e.p2.x, e.p2.y);
          this.rings.push(ring);
        }
      });
      this.removeAnm(this.canvasIds[0]);
      const fun = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.rings.forEach((e) => {
          e.draw(ctx);
        });
        this.lines.forEach((e) => {
          e.draw(ctx);
        });
      };
      const option = {
        id: this.canvasIds[0],
        fun,
        params: [ctx],
      };
      this.addAnm(option);
    },
    modadd() {
      const p_s_n = (p) => {
        return { x: Number(p.x), y: Number(p.y) };
      };
      let p1 = p_s_n(this.p1),
        p2 = p_s_n(this.p2);
      let b = new Bezier(p1, p2);
      this.lines.push(b);
      let count = 3;
      for (let j = 0; j < count; j++) {
        let ring = new Ring(900 + j * random(500, 800));
        ring.init(p2.x, p2.y);
        this.rings.push(ring);
      }
    },
    mod2() {
      const data = this.lineData;
      this.lines2 = [];
      let ctx = this.$refs.cvs1_2.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      data.forEach((e) => {
        let b = new Bezier2(e.p1, e.p2);
        this.lines2.push(b);
      });
      this.removeAnm(this.canvasIds[1]);
      const fun = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.lines2.forEach((e) => {
          e.draw(ctx);
        });
      };
      const option = {
        id: this.canvasIds[1],
        fun,
        params: [ctx],
      };
      this.addAnm(option);
    },
    ball() {
      this.dots = [];
      let ctx = this.$refs.cvs2.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.dotdatas.forEach((e) => {
        let md = new Movedot(300, 300, e, this.d3);
        this.dots.push(md);
      });
      this.removeAnm(this.canvasIds[2]);
      const fun = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.dots.forEach((e) => {
          e.draw(ctx);
        });
        if (this.links) link(this.dots, ctx);
      };
      const option = {
        id: this.canvasIds[2],
        fun,
        params: [ctx],
      };
      this.addAnm(option);
    },
    link() {
      this.links = !this.links;
    },
    to3d() {
      this.d3 = !this.d3;
      this.dots.forEach((e) => {
        e.dotRefresh(this.d3);
      });
    },
    arc() {
      let ctx = this.$refs.cvs3.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.ra = new RotateArc();
      this.ra.init();
      this.removeAnm(this.canvasIds[3]);
      const fun = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.ra && this.ra.draw(ctx);
      };
      const option = {
        id: this.canvasIds[3],
        fun,
        params: [ctx],
      };
      this.addAnm(option);
    },
    uni() {
      let ctx = this.$refs.cvs4.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // let w = ctx.canvas.width,
      //   h = ctx.canvas.height;
    },
    clear() {
      this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
  },
  mounted() {
    this.$emit("getPath", this.$route.path);
  },
  destroyed() {
    this.stop();
  },
};
</script>
<style lang="scss" scoped>
@mixin lightFontBlue($color) {
  color: $color;
  text-shadow: 0px 0px 10px #426ab3, 0px 0px 10px #426ab3, 0px 0px 10px #426ab3,
    0px 0px 10px #426ab3;
}
.other-anm {
  padding-top: 80px;
  font-size: 12px;
  overflow-y: scroll;
  height: 100%;
  @include lightFontBlue(#fff);
  * {
    max-width: 100vw;
  }
  div {
    line-height: 40px;
  }
  .bd-bt {
    border-bottom: 1px solid rgb(86, 3, 241);
  }
  .bd-rt {
    border-right: 1px solid rgb(86, 3, 241);
  }
  .gif-list {
    width: 1440px;
    margin: 20px auto;
    columns: 4;
    column-gap: 30px;
    .gif-item {
      width: 100%;
      break-inside: avoid;
      margin-bottom: 30px;
      img {
        width: 100%;
      }
      p {
        font-size: 18px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .other-anm .gif-list {
    columns: 1;
    padding: 0 20px;
    .gif-item {
      border-bottom: 1px solid rgb(86, 3, 241);
      margin-bottom: 50px;
    }
    p {
      margin: 0;
      line-height: 30px;
      height: 30px;
    }
  }
}
</style>

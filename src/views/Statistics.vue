<template>
  <div class="stat">
    <el-row>
      <el-col>
        <div class="charts" id="charts"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getVisits } from "@/utils/api";
export default {
  name: "Statistics",
  data() {
    return {
      charts: null,
    };
  },
  methods: {
    upINT(arr) {
      let max = Math.max(...arr);
      let max_ = 10;
      let ints = [10000, 1000, 100, 10];
      for (let i = 0; i < ints.length; i++) {
        let e = ints[i];
        if (max / e > 1) {
          max_ = Math.ceil(max / e) * e;
          break;
        }
      }
      return max_;
    },
    async getStatData(type = 0) {
      let data = await getVisits({ type });
      let legend,
        xAxis,
        yAxis = {},
        series,
        title;
      let allCount = data.map((e) => {
        return e.count;
      });
      let yMax = this.upINT(allCount);
      switch (type) {
        case 0:
          legend = {
            data: ["访问量"],
          };
          xAxis = {
            data: data.map((e) => {
              return e.hour;
            }),
          };
          yAxis = {
            type: "value",
            scale: true,
            name: "访问量",
            min: 0,
            max: yMax,
          };
          series.push({
            name: "访问量",
            type: "line",
            data: data.map((e) => {
              return e.count;
            }),
          });
          title = "今日访问量";
          this.initCharts(title, legend, yAxis, xAxis, series);
          break;
        case 1:
          legend = {
            data: ["访问量"],
          };
          xAxis = {
            data: data.map((e) => {
              return e.hour;
            }),
          };
          yAxis = {
            type: "value",
            scale: true,
            name: "访问量",
            min: 0,
            max: yMax,
          };
          series.push({
            name: "访问量",
            type: "line",
            data: data.map((e) => {
              return e.count;
            }),
          });
          title = "昨日访问量";
          this.initCharts(title, legend, yAxis, xAxis, series);
          break;
        case 2:
          legend.data.push("近7日访问量");
          break;
        case 3:
          legend.data.push("本月访问量");
          break;
        case 4:
          legend.data.push("上月访问量");
          break;
        case 5:
          legend.data.push("年访问量");
          break;

        default:
          break;
      }
    },
    initCharts(title, legend, yAxis, xAxis, series) {
      if (this.charts === null) {
        this.charts = this.$echarts.init(document.getElementById("charts"));
      }
      //配置图表
      var option = {
        title: {
          text: title,
        },
        tooltip: {},
        legend,
        xAxis,
        yAxis,
        series,
      };
      this.charts.setOption(option);
    },
  },
  async mounted() {},
};
</script>
<style lang="scss" scoped>
.stat {
  height: 100%;
  padding-top: 80px;
  font-size: 12px;
  .charts {
    width: 100%;
    max-width: 800px;
    max-height: 600px;
  }
}
</style>

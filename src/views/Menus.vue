<template>
  <div class="menus">
    <el-row class="list">
      已吃列表：
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期"> </el-table-column>
        <el-table-column prop="meat" label="荤菜一"> </el-table-column>
        <el-table-column prop="meat2" label="荤菜二"> </el-table-column>
        <el-table-column prop="dishes" label="素菜"> </el-table-column>
      </el-table>
    </el-row>
    <el-row class="handle">
      <div style="margin-top: 10px">
        荤菜1：
        <el-select v-model="checkM1" placeholder="请选择">
          <el-option
            v-for="item in mt1Arr"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 5px"
          type="primary"
          size="mini"
          @click="m1Rnd"
        >
          随机
        </el-button>
      </div>
      <!-- singleRnd('checkM2', mt2Arr, 'cp_m_2') -->
      <div style="margin-top: 10px">
        荤菜2：
        <el-select v-model="checkM2" placeholder="请选择">
          <el-option
            v-for="item in mt2Arr"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 5px"
          type="primary"
          size="mini"
          @click="m2Rnd"
          >随机
        </el-button>
      </div>
      <div style="margin-top: 10px">
        素菜：
        <el-select v-model="checkDis" placeholder="请选择">
          <el-option
            v-for="item in dArr"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 5px"
          type="primary"
          size="mini"
          @click="dRnd"
          >随机
        </el-button>
      </div>
      <div style="margin-top: 10px">
        <el-button type="primary" size="mini" @click="allRandom"
          >随机</el-button
        >
        <el-button type="warning" size="mini" @click="out">出菜</el-button>
        <el-button type="danger" size="mini" @click="reset">重置</el-button>
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      checkM1: null,
      checkM2: null,
      checkDis: null,
      tableData: [],
      meats: [],
      dishes: [],
      mt1Arr: [],
      mt2Arr: [],
      dArr: [],
    };
  },
  methods: {
    random(n, r) {
      if ((arguments.length < 2 && ((r = n), (n = 0)), n > r)) {
        var a = r;
        (r = n), (n = a);
      }
      return Math.floor(Math.random() * (r - n + 1)) + n;
    },
    // 刷新
    refresh() {
      this.init();
      let str1 = window.localStorage.getItem("cp_m_1") || "";
      let ckdM1Arr = [];
      if (str1) {
        ckdM1Arr = str1.split(",").map((e) => {
          return parseInt(e);
        });
      } else {
        ckdM1Arr = [];
      }
      ckdM1Arr.forEach((e) => {
        let index = this.meats[0].findIndex((e2) => {
          return e2.key == e;
        });
        this.meats[0].splice(index, 1);
      });
      this.mt1Arr = this.meats[0];

      let str2 = window.localStorage.getItem("cp_m_2") || "";
      let ckdM2Arr;
      if (str2) {
        ckdM2Arr = str2.split(",").map((e) => {
          return parseInt(e);
        });
      } else {
        ckdM2Arr = [];
      }
      ckdM2Arr.forEach((e) => {
        let index = this.meats[1].findIndex((e2) => {
          return e2.key == e;
        });
        this.meats[1].splice(index, 1);
      });
      this.mt2Arr = this.meats[1];

      let str3 = window.localStorage.getItem("cp_d") || "";
      let ckdDArr;
      if (str3) {
        ckdDArr = str3.split(",").map((e) => {
          return parseInt(e);
        });
      } else {
        ckdDArr = [];
      }
      ckdDArr.forEach((e) => {
        let index = this.dishes.findIndex((e2) => {
          return e2.key == e;
        });
        this.dishes.splice(index, 1);
      });
      this.dArr = this.dishes;
    },
    // 获得列表
    getTable() {
      let logs = window.localStorage.getItem("logs") || "[]";
      logs = JSON.parse(logs);
      this.tableData = logs;
    },
    singleRnd(name, arr, store_name) {
      let str = window.localStorage.getItem(store_name);
      let ckdnum = [];
      if (str) {
        ckdnum = str.split(",");
      }
      this[name] = arr[this.random(0, arr.length - 1)].key;
      let has = ckdnum.some((e) => {
        return this[name] == e;
      });
      if (has) this.singleRnd(name, arr, store_name);
    },
    m1Rnd() {
      let allIndexs = this.mt1Arr.map((e) => {
        return e.key;
      });
      this.checkM1 = allIndexs[this.random(0, allIndexs.length - 1)];
    },
    m2Rnd() {
      let allIndexs = this.mt2Arr.map((e) => {
        return e.key;
      });
      this.checkM2 = allIndexs[this.random(0, allIndexs.length - 1)];
    },
    dRnd() {
      let allIndexs = this.dArr.map((e) => {
        return e.key;
      });
      this.checkDis = allIndexs[this.random(0, allIndexs.length - 1)];
    },
    allRandom() {
      // this.singleRnd("checkM1", this.mt1Arr, "cp_m_1");
      // this.singleRnd("checkM2", this.mt2Arr, "cp_m_2");
      // this.singleRnd("checkDis", this.dArr, "cp_d");
      this.m1Rnd();
      this.m2Rnd();
      this.dRnd();
    },
    setCkd() {
      let str1 = window.localStorage.getItem("cp_m_1");
      let ckdM1Arr;
      if (str1) {
        ckdM1Arr = str1.split(",").map((e) => {
          return parseInt(e);
        });
      } else {
        ckdM1Arr = [];
      }
      ckdM1Arr.push(this.checkM1);
      window.localStorage.setItem("cp_m_1", ckdM1Arr.join(","));
      let index = this.meats[0].findIndex((e) => {
        return this.checkM1 == e.key;
      });
      this.meats[0].splice(index, 1);
      window.localStorage.setItem("meat1", JSON.stringify(this.meats[0]));

      let str2 = window.localStorage.getItem("cp_m_2");
      let ckdM2Arr;
      if (str2) {
        ckdM2Arr = str2.split(",").map((e) => {
          return parseInt(e);
        });
      } else {
        ckdM2Arr = [];
      }
      ckdM2Arr.push(this.checkM2);
      window.localStorage.setItem("cp_m_2", ckdM2Arr.join(","));
      let index2 = this.meats[1].findIndex((e) => {
        return this.checkM2 == e.key;
      });
      this.meats[1].splice(index2, 1);
      window.localStorage.setItem("meat2", JSON.stringify(this.meats[1]));

      let str3 = window.localStorage.getItem("cp_d");
      let ckdDArr;
      if (str3) {
        ckdDArr = str3.split(",").map((e) => {
          return parseInt(e);
        });
      } else {
        ckdDArr = [];
      }
      ckdDArr.push(this.checkDis);
      window.localStorage.setItem("cp_d", ckdDArr.join(","));
      let index3 = this.dishes.findIndex((e) => {
        return this.checkDis == e.key;
      });
      this.dishes.splice(index3, 1);
      window.localStorage.setItem("dishes", JSON.stringify(this.dishes));
    },
    out() {
      this.$confirm("出菜后不可更改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.setLogs();
          this.setCkd();
          this.getTable();
          this.refresh();
          this.checkM1 = null;
          this.checkM2 = null;
          this.checkDis = null;
        })
        .catch({});
    },
    init() {
      this.meats = [
        [
          { key: 0, label: "红烧排骨" },
          { key: 1, label: "炖排骨" },
          { key: 2, label: "泡椒牛蛙" },
          { key: 3, label: "红烧牛肉" },
          { key: 4, label: "红烧肥肠" },
          { key: 5, label: "黄焖鸡" },
          { key: 6, label: "老鸭汤" },
          { key: 7, label: "藕花生米炖猪蹄" },
          { key: 8, label: "番茄肉丸子汤" },
          { key: 9, label: "老母鸡汤" },
          { key: 10, label: "芋儿鸡" },
          { key: 11, label: "水滑肉" },
        ],
        [
          { key: 0, label: "夹烧肉" },
          { key: 1, label: "口水鸡/手撕鸡" },
          { key: 2, label: "青椒肉丝" },
          { key: 3, label: "干煸肥肠" },
          { key: 4, label: "青椒兔" },
          { key: 5, label: "回锅肉" },
          { key: 6, label: "蒸虾" },
          { key: 7, label: "牙签牛肉" },
          { key: 8, label: "辣子鸡" },
          { key: 9, label: "宫保鸡丁" },
          { key: 10, label: "蒸鱼" },
          { key: 11, label: "毛血旺" },
          { key: 12, label: "小炒芹菜牛肉" },
          { key: 13, label: "糯米排骨" },
        ],
      ];
      this.dishes = [
        { key: 0, label: "酱生菜" },
        { key: 1, label: "干煸四季豆" },
        { key: 2, label: "青菜" },
        { key: 3, label: "肉沫豆腐" },
        { key: 4, label: "煎豆腐" },
        { key: 5, label: "炒丝瓜" },
        { key: 6, label: "金针菇炒鸡蛋" },
        { key: 7, label: "油糟莲白" },
        { key: 8, label: "炝白菜" },
        { key: 9, label: "豆腐炖白菜苕粉" },
      ];
    },
    setLogs() {
      let logs = window.localStorage.getItem("logs") || "[]";
      logs = JSON.parse(logs);
      const { checkM1, checkM2, checkDis } = this;
      let index1 = this.mt1Arr.findIndex((e) => {
        return e.key == checkM1;
      });
      let index2 = this.mt2Arr.findIndex((e) => {
        return e.key == checkM2;
      });
      let index3 = this.dArr.findIndex((e) => {
        return e.key == checkDis;
      });
      if (
        this.mt1Arr.length === 0 &&
        this.mt2Arr.length === 0 &&
        this.dArr.length === 0
      ) {
        this.$message.error("都吃完了，你真吊~");
        return;
      }
      logs.push({
        date: this.getDate(),
        meat: this.mt1Arr.length ? this.mt1Arr[index1].label : "-",
        meat2: this.mt2Arr.length ? this.mt2Arr[index2].label : "-",
        dishes: this.dArr.length ? this.dArr[index3].label : "-",
      });
      window.localStorage.setItem("logs", JSON.stringify(logs));
    },
    getDate() {
      let a = new Date();
      let y = a.getFullYear();
      let m = a.getMonth();
      let d = a.getDate();
      return `${y}-${m}-${d}`;
    },
    reset() {
      this.$confirm("此操作将重置所有内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.clear();
        })
        .catch({});
    },
  },
  mounted() {
    this.refresh();
    this.getTable();
  },
};
</script>
<style lang="scss" scoped>
.menus {
  height: 100%;
  font-size: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .list {
    height: 60%;
    overflow-y: scroll;
    padding-bottom: 30px;
    box-shadow: 0 5px 5px #0001;
  }
  .handle {
    flex: 1;
  }
}
</style>
<style>
.el-message-box {
  max-width: 420px;
  width: 80%;
}
</style>

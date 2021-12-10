<template>
  <div
    id="app"
    :style="`background: linear-gradient(to bottom, ${backgroundTopColor}, ${backgroundBottomColor})`"
  >
    <Header @callBrotherEvent="childFn" v-if="!isOther" />
    <router-view ref="child" />
  </div>
</template>
<script>
import Header from "@/components/Header";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tips: false,
    };
  },
  computed: {
    ...mapGetters(["backgroundTopColor", "backgroundBottomColor"]),
    isOther() {
      return this.$route.fullPath === "/menus";
    },
  },
  components: {
    Header,
  },
  methods: {
    childFn(datum) {
      const { name, params: option } = datum;
      this.$refs.child[name] && this.$refs.child[name](option);
    },
  },
};
</script>
<style lang="scss">
@import "styles/common.scss";
* {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
body,
html {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  font: 75px "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
    "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
@media screen and (max-width: 750px) {
  html {
    font: 75px "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
      "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
    .el-message {
      max-width: 96vw !important;
      min-width: 60vw !important;
      .el-message__icon {
        font-size: 14px;
      }
    }
  }
}
</style>
<style lang="css"></style>

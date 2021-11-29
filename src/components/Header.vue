<template>
  <div class="header-wrap"></div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      e: "e",
    };
  },
};
</script>
<style lang="scss" scoped>
.header-wrap {
  height: 80px;
  width: 100%;
  background: #0006;
  opacity: 0.5;
  position: absolute;
  top: 0;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
    background: #0008;
  }
  z-index: 100;
}
</style>

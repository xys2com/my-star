<template>
  <div>
    <itd class="inverted-test" ref="test" :src.sync="img" />
  </div>
</template>
<script>
import Itd from "@/components/Inverted.vue";
export default {
  name: "test",
  components: {
    itd: Itd,
  },
  data() {
    return {
      img: `test.jpg`,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
  },
};
</script>
<style lang="scss" scoped></style>

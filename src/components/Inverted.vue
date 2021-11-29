<template>
  <div class="inverted" ref="inverted-main"></div>
</template>
<script>
export default {
  props: {
    speed: {
      type: Number,
      default: 0.25,
    },
    scale: {
      type: Number,
      default: 1,
    },
    waves: {
      type: Number,
      default: 10,
    },
    height: {
      type: Number,
      default: 0.5,
    },
    canvasId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      image: null,
      started: false,
      notTime: Date.now(),
    };
  },
  mounted() {
    // this.startRender(this.src);
  },
  methods: {
    startRender(cvs) {
      const _cvs = document.createElement("canvas");
      _cvs.height = document.body.clientHeight * this.height;
      _cvs.width = document.body.clientWidth;
      const _ctx = _cvs.getContext("2d");
      _ctx.drawImage(
        cvs,
        0,
        0,
        cvs.width,
        cvs.height,
        0,
        0,
        cvs.width,
        cvs.height
      );
      if (this.started) {
        return;
      }
      this.image = _cvs;
      this.$refs["inverted-main"].appendChild(this.image);
      this.init();
    },
    init() {
      const { waves, speed, scale, height, image } = this;
      let cvs = document.createElement("canvas");
      cvs.style.top = 0;
      let c = cvs.getContext("2d");

      let imgLoad = false;
      const img = image;
      img.parentNode.insertBefore(cvs, img);
      let w = document.body.clientWidth,
        h = document.body.clientHeight,
        dw = w,
        dh = h * height;

      let offset = 0,
        frame = 0,
        max_frames = 0,
        frames = [];
      // img.onload = () => {
      c.save();

      c.canvas.width = img.width;
      c.canvas.height = img.height * 2;
      c.canvas.style.zIndex = "5";

      c.drawImage(img, 0, 0);
      c.scale(1, -1);
      c.drawImage(img, 0, -img.height * 2);

      imgLoad = true;

      c.restore();

      w = c.canvas.width;
      h = c.canvas.height;
      dw = w;
      dh = h * height;

      var id = c.getImageData(0, h * height, w, h).data; // 获取图片像素点阵色彩信息
      var end = false;
      c.save();
      while (!end) {
        var odd = c.getImageData(0, h * height, w, h);
        var od = odd.data;
        var pixel = 0;
        for (var y = 0; y < dh; y++) {
          // 对二维数组进行遍历
          for (var x = 0; x < dw; x++) {
            // 模拟正弦波 来计算像素点的偏移位置
            var displacement =
              (scale * 10 * Math.sin(dh / (y / waves) + -offset)) | 0;
            var j = ((displacement + y) * w + x + displacement) * 4;
            if (j < 0) {
              pixel += 4;
              continue;
            }
            var m = j % (w * 4);
            var n = scale * 10 * (y / waves);
            if (m < n || m > w * 4 - n) {
              var sign = y < w / 2 ? 1 : -1;
              od[pixel] = od[pixel + 4 * sign];
              od[++pixel] = od[pixel + 4 * sign];
              od[++pixel] = od[pixel + 4 * sign];
              od[++pixel] = od[pixel + 4 * sign];
              ++pixel;
              continue;
            }

            if (id[j + 3] != 0) {
              od[pixel] = id[j];
              od[++pixel] = id[++j];
              od[++pixel] = id[++j];
              od[++pixel] = id[++j];
              ++pixel;
            } else {
              od[pixel] = od[pixel - w * 4];
              od[++pixel] = od[pixel - w * 4];
              od[++pixel] = od[pixel - w * 4];
              od[++pixel] = od[pixel - w * 4];
              ++pixel;
            }
          }
        }

        if (offset > speed * (6 / speed)) {
          offset = 0;
          max_frames = frame - 1;
          frame = 0;
          end = true;
        } else {
          offset += speed;
          frame++;
        }
        frames.push(odd);
      }
      c.restore();
      if (!img) {
        c.height = c.height / 2;
      }
      setTimeout(() => {
        img.parentNode.removeChild(img);
        this.started = true;
      }, 3000);
      // };
      const fun = () => {
        const _now_time = Date.now();
        if (_now_time - this.notTime < 30) {
          return;
        }
        this.notTime = _now_time;
        if (imgLoad) {
          if (!img) {
            c.putImageData(frames[frame], 0, 0);
          } else {
            c.putImageData(frames[frame], 0, h * height);
          }
          c.clearRect(0, 0, 1920, 400);
          if (frame < max_frames) {
            frame++;
          } else {
            frame = 0;
          }
        }
      };
      const option = {
        fun,
      };
      this.$emit("add", option);
      // setInterval(function () {
      // }, 33.33);
    },
  },
};
</script>
<style lang="scss" scoped></style>

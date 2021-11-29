import { random } from "@/utils/tool";
export function FrequencySpectrum(id) {
  this.dom = document.getElementById(id);
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.dom.innerHTML = "";

  this.canvas.width = this.dom.clientWidth * 2;
  this.canvas.height = this.dom.clientHeight * 2;
  this.canvas.style.transform = `scale(0.5, 0.5) translate(-50%, -50%)`;

  this.dh = this.canvas.height;
  this.grd = this.ctx.createLinearGradient(0, this.dh * 0.2, 1, this.dh);
  this.grd.addColorStop(0, "#ff0");
  this.grd.addColorStop(1, "#0ff");

  this.sx = 10;
  this.gap = (this.canvas.width - this.sx * 2) / 128; // 线条之间的间隙
  this.dotArr = [];

  this.runIndex = 0; // 用来决定 在画布中绘制哪种动画

  this.drawArrNames = ["draw", "drawBounceLine", "drawSportsDot"];

  this.drawAnmByName = (sizeData) => {
    let name = this.drawArrNames[this.runIndex];
    this[name](sizeData);
  };

  this.dom.appendChild(this.canvas);
  // 直线柱状谱
  this.draw = (arr) => {
    this.ctx.save();
    this.ctx.strokeStyle = this.grd;
    this.ctx.lineWidth = 2;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < arr.length - 1; i += 2) {
      // 遍历 只取其中一半的内容
      let h = (arr[i] / 255) * this.canvas.height * 0.8; // 计算该位的高度
      h = h < 5 ? 5 : h;
      let ix = this.sx + i / 2 + (i / 2) * this.gap; // 起始位置 + 当前下标乘以宽度（1px）+ 当前下标乘以间隙
      this.ctx.beginPath();
      this.ctx.moveTo(ix, this.dh);
      this.ctx.lineTo(ix, this.dh - h);
      this.ctx.fill();
      this.ctx.stroke();
    }
    this.ctx.restore();
  };
  // 范围内随机跳动谱
  this.drawBounceLine = (arr) => {
    this.ctx.save();
    this.clear();
    this.ctx.fillStyle = this.grd;
    this.ctx.strokeStyle = this.grd;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(
      0,
      this.canvas.height - (arr[0] / 255) * this.canvas.height * 0.8
    );
    for (let i = 0; i < 256; i += 2) {
      let h = this.canvas.height - (arr[i] / 255) * this.canvas.height * 0.8;
      let ix = this.sx + i / 2 + (i / 2) * this.gap;
      // 左右/上下 随机偏差
      this.ctx.lineTo(ix + random(-1, 1), h + random(-1, 1));
    }
    this.ctx.lineTo(
      this.canvas.width,
      this.canvas.height - (arr[255] / 255) * this.canvas.height * 0.8
    );
    this.ctx.stroke();
    this.ctx.restore();
  };

  // 运动的光点
  this.drawSportsDot = (arr) => {
    if (this.dotArr.length === 0) {
      dotInit();
    }

    this.clear();
    this.ctx.save();
    this.ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < this.dotArr.length; i++) {
      const item = this.dotArr[i];
      const rate = Number((arr[i] / 255).toFixed(2));
      const R = item.r * (rate < 0.5 ? 0.5 : rate);
      const img = getDotCanvas(item, R);
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(img, item.x - R, item.y - R);
      if (item.x >= 280 || item.x <= -R) {
        item.xd = item.xd * -1;
        item.xv = (random(2, 5) / 10).toFixed(1); // 变换速度
      }
      if (item.y >= 180 || item.y <= -R) {
        item.yd = item.yd * -1;
        item.yv = (random(2, 5) / 10).toFixed(1); // 变换速度
      }
      item.x += item.xd * item.xv;
      item.y += item.yd * item.yv;
    }
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  };
  // 返回一个canvas
  const getDotCanvas = (item, rateR) => {
    const c = document.createElement("canvas");
    const ct = c.getContext("2d");
    c.width = rateR * 2;
    c.height = rateR * 2;
    const hf = rateR;
    const gradient = ct.createRadialGradient(hf, hf, 0, hf, hf, hf);
    item.c--;
    if (item.c <= 0) {
      item.c = 360;
    }
    gradient.addColorStop(0.025, "#fff");
    gradient.addColorStop(0.25, "hsl(" + item.c + ", 61%, 33%)");
    gradient.addColorStop(0.9, "hsl(" + item.c + ", 64%, 6%)");
    gradient.addColorStop(1, "#0000");

    ct.fillStyle = gradient;
    ct.beginPath();
    ct.arc(hf, hf, hf, 0, Math.PI * 2);
    ct.fill();
    return c;
  };
  // 初始化圆点
  const dotInit = () => {
    for (let i = 0; i < 20; i++) {
      const d = {
        x: random(0, 280),
        y: random(0, 180),
        c: random(0, 360), // 颜色
        xd: random(0, 100) % 2 === 0 ? 1 : -1, // 1横向正方向 -1反方向
        yd: random(0, 100) % 2 === 0 ? 1 : -1, // 1竖向正方向 -1反方向
        xv: (random(2, 5) / 10).toFixed(1), // 速度
        yv: (random(2, 5) / 10).toFixed(1), // 速度
        r: 40, // 半径
      };
      this.dotArr.push(d);
    }
  };
  // 清除数据
  this.empty = () => {};

  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}

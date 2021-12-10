// import { random } from "@/utils/tool";

export function Ripple(x, y, ty, delay = 0) {
  this.rate = 0; // 比率
  this.velocity = 0.5; // 速度
  this.ap = 1; // 透明度
  this.x = x;
  this.y = y;
  this.count = 0;
  this.die = false;
  this.delay = delay;
  this.childrens = [];
  this.r = (this.y / ty < 0.2 ? 0.2 : this.y / ty) * 2;
  this.draw = function (ctx) {
    if (this.delay > 0) {
      this.delay--;
      return;
    }
    ctx.beginPath();
    ctx.globalAlpha = this.ap;
    ctx.ellipse(
      this.x,
      this.y,
      30 * this.rate,
      10 * this.rate,
      0,
      0,
      Math.PI * 2
    );
    if (this.rate > this.r) {
      this.ap = this.ap - 0.006;
    }
    if (this.ap <= 0) {
      this.die = true;
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#426ab3";
    ctx.stroke();
    this.rate += this.velocity / 10;
    this.velocity = this.velocity - 0.0005;
  };
}

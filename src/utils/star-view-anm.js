import { random } from "@/utils/tool";
//静止类型的星星构造函数
function StaticStar(options) {
  var s_width = options["width"];
  var s_height = options["height"];
  var max = options["max"];
  this.x = random(3, s_width - 3);
  this.y = random(3, s_height - 3);
  this.isMobile = options["isMobile"];
  this.r = this.isMobile ? random(8, 20) * 2 : random(8, 20);
  this.alpha = parseFloat(random(2, 10) / 10); //初始透明度
  this.star = createStar(this.r); //一个canvas 对象
  this.rd = random(1, max);
}
StaticStar.prototype.draw = function (ctx, stars) {
  if (stars)
    ctx.drawImage(
      this.star,
      this.x,
      this.y + (10 * stars[this.rd]) / 256,
      this.r,
      this.r
    );
  else ctx.drawImage(this.star, this.x, this.y, this.r, this.r);
};

//移动类型的星星构造函数
function MoveStar(options) {
  // 计算屏幕最远点到中心的直线距离
  function maxOrbit(x, y) {
    var max = Math.max(x, y),
      diameter = Math.round(Math.sqrt(max * max + max * max));
    return diameter;
  }
  let s_width = options["width"];
  let s_height = options["height"];
  this.isMobile = options["isMobile"];
  this.renderLimitX = options["limitX"];
  this.renderLimitY = options["limitY"];
  //路径相关属性
  this.orbitRadius = random(maxOrbit(s_width / 2, s_height / 2)); // 轨道半径
  this.radius = random(60, this.orbitRadius) / 10; // 自身半径，越大显示的星星越大
  this.orbitX = this.isMobile ? (s_width / 4) * 3 : s_width / 2; // 轨道中心 x
  this.orbitY = this.isMobile ? (s_height / 10) * 2 : (s_height / 10) * 8; // 轨道中心 y
  this.timePassed = random(0, 360); // 0 ~ 360° 的随机初始角度
  this.speed = this.isMobile
    ? random(this.orbitRadius) / 3000000
    : random(this.orbitRadius) / 2000000; // 旋转速度（这里指的到下一帧所变化的角度， 跟自身轨道半径有关）
  //自身相关属性
  // this.x = random(3, s_width - 3);
  // this.y = random(3, s_height - 3);
  this.r = this.isMobile ? random(8, 20) * 2 : random(8, 20); // 大小
  this.cycle = random(100, 800); //闪烁周期
  this.alpha = parseFloat(random(2, 10) / 10); //初始透明度
  this.symbol = -1; //闪烁标识
  this.star = createStar(this.r); //一个canvas 对象
}
MoveStar.prototype.draw = function (ctx) {
  // 根据角度计算x，y的位置
  var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX, // 计算下一帧的x位置
    y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY; // 计算下一帧的y位置
  // 视图外的星星不作渲染 （10 是一个容错值）
  if (
    x > this.renderLimitX + 10 ||
    x < -10 ||
    y > this.renderLimitY + 10 ||
    y < -10
  ) {
    this.timePassed -= this.speed; // 重设角度
    return;
  }
  // 用透明度的变化来体现闪烁效果
  this.alpha += parseFloat((this.cycle / 30000) * this.symbol); // 拉长周期长度
  if (this.alpha > 1) {
    this.alpha = 1;
    this.symbol = -1;
  }
  if (this.alpha < 0.4) {
    this.alpha = 0.4;
    this.symbol = 1;
  }
  ctx.globalAlpha = this.alpha;
  ctx.drawImage(
    this.star,
    x - this.radius,
    y - this.radius / 2,
    this.r,
    this.r
  );
  this.timePassed -= this.speed; // 重设角度
};

// 流星构造函数
function SmallMeteor(options) {
  // 横向编辑，纵向边界
  this.boundaryW = options.width || 1920;
  this.boundaryY = options.height || 1024;
  //
  this.ratio = random(200, 300);
  this.angle = random(335, 340);
  this.isMobile = options.isMobile;
  this.delay = random(100, 3000); // 延迟出现
  this.x = random(
    this.boundaryW / 2 - this.ratio / 2,
    this.boundaryW + this.ratio + this.boundaryW / 2
  );
  this.y = random(-100, -this.ratio);
  this.sx = this.x; // 初始位置
  this.sy = this.y; // 初始位置
  this.size = options.size || this.isMobile ? random(2, 3) : random(1, 2); // 大小
  this.tails = [];
  this.tailsLen = random(20, 30);

  this.v_co = random(20, 30); // 速度系数 越小速度越快

  this.ex =
    (Math.cos((Math.PI * 2 * this.angle) / 360) * this.ratio) / this.v_co; //x 轴移动量
  this.ey =
    (Math.sin((Math.PI * 2 * this.angle) / 360) * this.ratio) / this.v_co; //y 轴移动量

  this.draw = (ctx) => {
    if (this.delay > 0) {
      this.delay -= 16.66;
      return;
    }
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // 计算拖尾
    let ga = 1;
    if (this.tails.length > this.tailsLen) {
      this.tails.pop();
      this.tails.unshift({
        x: this.x,
        y: this.y,
        size: this.size,
        ga,
      });
    } else {
      this.tails.unshift({
        x: this.x,
        y: this.y,
        size: this.size,
        ga,
      });
    }
    // 设置位置
    this.x = this.x - this.ex;
    this.y = this.y - this.ey;
    if (this.x < -200 && this.y > this.boundaryY + 100) {
      // 重新设置位置
      this.ratio = random(200, 300);
      this.angle = random(335, 340);
      this.x = random(
        this.boundaryW / 2 - this.ratio / 2,
        this.boundaryW + this.ratio + this.boundaryW / 2
      );
      this.y = random(-100, -this.ratio);
      this.v_co = random(20, 40);
      this.x = this.sx;
      this.y = this.sy;
    }
    // 设置尾部
    this.tails.forEach((e, i) => {
      ctx.beginPath();
      ctx.globalAlpha = (50 - i) / 200;
      ctx.arc(e.x, e.y, e.size / 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
    });
  };
}

// 绘制星星
function createStar(R) {
  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");

  c.width = R * 3;
  c.height = R * 3;

  let r = R / 4;
  let x = R,
    y = R;
  ctx.save(); // 保存画笔状态
  //绘制星星主体
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.rotate(random(0, 360), x, y);
  // 绘制一个四角星
  for (var i = 0; i < 4; i++) {
    ctx.lineTo(
      Math.cos(((1 / 4 + i) * 2 * Math.PI) / 4) * R,
      -Math.sin(((1 / 4 + i) * 2 * Math.PI) / 4) * R
    );
    ctx.lineTo(
      Math.cos(((3 / 4 + i) * 2 * Math.PI) / 4) * r,
      -Math.sin(((3 / 4 + i) * 2 * Math.PI) / 4) * r
    );
  }
  ctx.strokeStyle = "rgba(255,255,255,.4)";
  ctx.fillStyle = "rgba(255,255,255,.4)";
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.restore(); // 返回之前保存的画笔状态

  //绘制星星的光晕
  var grd = ctx.createRadialGradient(R, R, 0, R, R, R);
  grd.addColorStop(0.025, "#fff");
  grd.addColorStop(0.1, "#fff");
  grd.addColorStop(0.15, "rgba(255,255,255,.4)");
  grd.addColorStop(0.25, "rgba(255,255,255,.3)");
  grd.addColorStop(0.4, "rgba(255,255,255,.2)");
  grd.addColorStop(1, "transparent");

  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(R, R, R, 0, Math.PI * 2);
  ctx.fill();
  //绘制星星的光晕
  return c;
}

export { StaticStar, MoveStar, SmallMeteor };

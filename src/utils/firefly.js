import { random } from "@/utils/tool";
/*
 *@startp 开始的位置
 */
export function Firefly(
  startp = { x: 230, y: 40 },
  limitX = 1920,
  limitY = 100,
  isMobile = false
) {
  this.isMobile = isMobile; // 是否移动端
  this.id = `ff-${Math.random().toString(32).slice(-8)}`;
  this.nx = this.isMobile ? startp.x * 2 : startp.x; // 下一次的位置x
  this.ny = this.isMobile ? startp.y * 2 : startp.y; // 下一次的位置y
  this.t = 0; // 用于获得位置的timer t
  this.vt = this.isMobile ? random(4, 6) / 3600 : random(4, 8) / 2400; // 越小,速度越小
  this.flyPathNum = 0;
  this.flyingType = 0; // 0 二次贝塞尔 1三次贝塞尔
  this.limitX = limitX;
  this.limitY = limitY;
  this.lightCount = 0; // 闪烁次数
  this.alpha = parseFloat(random(2, 10) / 10); //初始透明度
  this.lightV = random(2, 6) / 500; // 闪烁速度
  this.symbol = -1; //闪烁标识
  this.flyStep = 0; // 0 飞行、闪烁; 1 停止飞行只闪烁; 2 死亡
  // let testpath = [
  //   [230, 40, 300, -10, 320, 25],
  //   [320, 25, 350, 75, 430, 15, 460, 45],
  // ];
  this.path = this.isMobile ? createPathsMobile() : createPathsPc();
  this.r = this.isMobile ? random(3, 7) * 2 : random(3, 7);
  this.firefly = createFirefly(this.r);

  this.init = () => {
    this.flyPathNum = 0;
    this.flyingType = 0;
    this.t = 0;
    this.flyStep = 0;
  };

  this.fly = function (ctx) {
    // 到下一个路径飞行
    // 应是 1；但需要给一个误差值
    if (this.t >= 0.995) {
      this.flyPathNum++;
      if (this.flyPathNum >= this.path.length) {
        this.flyPathNum = 0;
        this.flyStep = 1;
        return;
      } else {
        this.t = 0;
      }
    }
    // 计算x y 位置
    let flyPath = this.path[this.flyPathNum];
    this.flyingType = flyPath.length === 6 ? 0 : 1;
    if (this.flyingType === 0) {
      // 二次贝塞尔曲线
      let [x1, y1, x2, y2, x3, y3] = flyPath;
      let pow = Math.pow;
      let nx =
        pow(1 - this.t, 2) * x1 +
        2 * this.t * (1 - this.t) * x2 +
        pow(this.t, 2) * x3;
      this.nx = this.isMobile ? nx * 2 : nx;

      let ny =
        pow(1 - this.t, 2) * y1 +
        2 * this.t * (1 - this.t) * y2 +
        pow(this.t, 2) * y3;
      this.ny = this.isMobile ? ny * 2 : ny;
    } else if (this.flyingType === 1) {
      // 三次贝塞尔曲线
      let [x1, y1, x2, y2, x3, y3, x4, y4] = flyPath;
      const { pow } = Math;
      let nx =
        x1 * pow(1 - this.t, 3) +
        3 * x2 * this.t * pow(1 - this.t, 2) +
        3 * x3 * pow(this.t, 2) * (1 - this.t) +
        x4 * pow(this.t, 3);
      this.nx = this.isMobile ? nx * 2 : nx;

      let ny =
        y1 * pow(1 - this.t, 3) +
        3 * y2 * this.t * pow(1 - this.t, 2) +
        3 * y3 * pow(this.t, 2) * (1 - this.t) +
        y4 * pow(this.t, 3);
      this.ny = this.isMobile ? ny * 2 : ny;
    }

    // 平衡飞行速度
    // const { abs } = Math;
    // let div = abs(flyPath[5] - flyPath[0]);
    // if (div > 400) {
    //   this.t = this.t + this.vt / 3;
    // } else if (div > 300 && div < 400) {
    //   this.t = this.t + this.vt / 2;
    // } else if (div > 100 && div < 300) {
    //   this.t = this.t + this.vt;
    // }
    this.t = this.t + this.vt;
    let r = this.firefly.width / 2;
    this.alpha += this.lightV * this.symbol;
    if (this.alpha > 1) {
      this.alpha = 1;
      this.symbol = -1;
    }
    if (this.alpha < 0.2) {
      this.alpha = 0.2;
      this.symbol = 1;
    }
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(
      this.firefly,
      this.nx - r,
      this.ny - r,
      this.r * 2,
      this.r * 2
    );
    ctx.restore();
  };
  // this.light = function (ctx) {
  //   let r = this.r / 2;
  //   ctx.save();
  //   ctx.beginPath();
  //   ctx.globalAlpha = this.alpha;
  //   ctx.drawImage(this.firefly, this.nx - r, this.ny - r, 10, 10);
  //   ctx.restore();
  //   this.alpha += this.lightV * this.symbol;
  //   if (this.lightCount >= 6 && this.symbol === -1) {
  //     this.flyStep = 2;
  //   }
  //   if (this.alpha > 1) {
  //     this.lightCount++;
  //     this.alpha = 1;
  //     this.symbol = -1;
  //   }
  //   if (this.alpha < 0.3) {
  //     this.lightCount++;
  //     this.alpha = 0.2;
  //     this.symbol = 1;
  //   }
  // };

  // 少量限制随机曲线
  // eslint-disable-next-line
  function createPaths() {
    let start = false;
    let nowx = startp.x;
    // let nowy = startp.y;
    let paths = [];
    while (nowx < limitX) {
      let p = [];
      let type = random(0, 9) % 2; // 0 二次贝塞尔曲线，1三次贝塞尔曲线
      // 第一个点
      if (!start) {
        p.push(startp.x, startp.y);
        start = true;
      } else {
        let lastPath = paths[paths.length - 1];
        let lastPathLen = lastPath.length;
        let x = lastPath[lastPathLen - 2],
          y = lastPath[lastPathLen - 1];
        p.push(x, y);
      }
      // 后面的点
      if (type === 0) {
        let path_x = p[0];
        let path_y = p[1];
        for (let i = 0; i < 2; i++) {
          let x = (path_x += random(-40, 160));

          let y;
          if (path_y < 40) {
            y = path_y += random(0, 50);
          } else if (path_y >= 40) {
            y = path_y += random(-50, 0);
          }
          path_x = x;
          p.push(x);
          p.push(y);
        }
      } else {
        let path_x = p[0];
        let path_y = p[1];
        for (let i = 0; i < 3; i++) {
          let x = (path_x += random(-40, 160));

          let y;
          if (path_y < 40) {
            y = path_y += random(0, 50);
          } else if (path_y >= 40) {
            y = path_y += random(-50, 0);
          }
          path_x = x;
          p.push(x);
          p.push(y);
        }
      }
      nowx = p[p.length - 2];
      paths.push(p);
    }
    return paths;
  }
  // 限制三次贝塞尔曲线，应用于pc
  function createPathsPc() {
    let start = false;
    let nowx = startp.x;
    let paths = [];
    let stepx = random(100, 150);
    let count = 0;
    let dir = random(0, 1) ? true : false;
    while (nowx < limitX) {
      // 有一定几率打个转
      let spin = random(1, 100) < 20 ? true : false;
      let p = [];
      // 第一个点
      if (!start) {
        p.push(startp.x, startp.y);
        start = true;
      } else {
        let lastPath = paths[paths.length - 1];
        let lastPathLen = lastPath.length;
        let x = lastPath[lastPathLen - 2],
          y = lastPath[lastPathLen - 1];
        p.push(x, y);
      }
      // 后面三个点
      if (spin) {
        // 打转路径
        let x1 = p[0] + random(50, 100),
          y1 = p[1] + random(-40, -80),
          x2 = p[0] + random(50, 100),
          y2 = p[1] + random(40, 80),
          x3 = p[0],
          y3 = p[1];
        if (!dir) {
          // 更改打转方向（顺逆时针）
          let _x = x1,
            _y = y1;
          x1 = x2;
          y1 = y2;
          x2 = _x;
          y2 = _y;
        }
        p.push(x1, y1, x2, y2, x3, y3);
      } else {
        let x1 = p[0] + stepx / 6 + (count * random(75, 125)) / 4,
          y1 = dir ? random(-10, 40) : random(40, 90);
        p.push(x1, y1);
        let x2 = p[2] + stepx / 3 + (count * random(75, 125)) / 4,
          y2 = dir ? random(-10, 40) : random(40, 90);
        p.push(x2, y2);
        let x3 = p[4] + stepx / 2 + (count * random(75, 125)) / 4,
          y3 = random(30, 50);
        p.push(x3, y3);
        count++;
        dir = !dir;
      }
      nowx = p[p.length - 2];
      paths.push(p);
    }
    return paths;
  }
  // 限制三次贝塞尔曲线，应用于mobile
  function createPathsMobile() {
    let start = false;
    let nowy = startp.y;
    let paths = [];
    let r1 = limitY / 10;
    let r2 = limitY / 6;
    let stepy = random(r1, r2);
    let count = 0;
    let dir = random(0, 1) ? true : false;
    while (nowy < limitY) {
      // 有一定几率打个转
      let spin = random(1, 100) < 60 ? true : false;
      let p = [];
      // 第一个点
      if (!start) {
        p.push(startp.x, startp.y);
        start = true;
      } else {
        let lastPath = paths[paths.length - 1];
        let lastPathLen = lastPath.length;
        let x = lastPath[lastPathLen - 2],
          y = lastPath[lastPathLen - 1];
        p.push(x, y);
      }
      // 后面三个点
      if (spin) {
        // 打转路径
        let x1 = p[0] + random(70, 210),
          y1 = p[1] + random(20, 40),
          x2 = p[0] + random(-70, -210),
          y2 = p[1] + random(20, 40),
          x3 = p[0],
          y3 = p[1];
        if (!dir) {
          // 更改打转方向（顺逆时针）
          let _x = x1,
            _y = y1;
          x1 = x2;
          y1 = y2;
          x2 = _x;
          y2 = _y;
        }
        p.push(x1, y1, x2, y2, x3, y3);
      } else {
        let x1 = dir ? random(-40, 140) : random(120, 280),
          y1 = p[1] + stepy / 6 + (count * random(25, 45)) / 4;
        p.push(x1, y1);

        let x2 = dir ? random(-40, 140) : random(120, 280),
          y2 = p[3] + stepy / 3 + (count * random(25, 45)) / 4;
        p.push(x2, y2);

        let x3 = random(70, 210),
          y3 = p[5] + stepy / 2 + (count * random(25, 45)) / 4;
        p.push(x3, y3);
        count++;
        dir = !dir;
      }
      nowy = p[p.length - 1];
      paths.push(p);
    }
    return paths;
  }

  function createFirefly(R) {
    // #8cd629 绿色；#fff62b 黄色
    let c = document.createElement("canvas");
    c.width = R * 2;
    c.height = R * 2;
    let ctx = c.getContext("2d");
    let x = R,
      y = R;
    let grd = ctx.createRadialGradient(R, R, 0, R, R, R);
    const color = random(0, 1) ? "#fff62b" : "#8cd629";
    grd.addColorStop(0.025, "#fff");
    grd.addColorStop(0.1, "#fff");
    grd.addColorStop(0.15, `${color}`); // 1
    grd.addColorStop(0.25, `${color}cc`); // .8
    grd.addColorStop(0.4, `${color}99`); // .6
    grd.addColorStop(0.6, `${color}66`); // .4
    grd.addColorStop(0.8, `${color}33`); // .2
    grd.addColorStop(1, "transparent");
    ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    return c;
  }
}

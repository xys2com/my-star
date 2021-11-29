export const random = function (n, r) {
  // eslint-disable-next-line
  if ((arguments.length < 2 && ((r = n), (n = 0)), n > r)) {
    var a = r;
    (r = n), (n = a);
  }
  return Math.floor(Math.random() * (r - n + 1)) + n;
};
export const $ = (e) => {
  const els = document.querySelectorAll(e);
  return els.length === 1 ? els[0] : els;
};

export const toArrayBuffer = (buf) => {
  return new Promise((res) => {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    res(ab);
  });
};

//计算最远点到中心的直线距离
export const maxOrbit = (x, y) => {
  var max = Math.max(x, y),
    diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
};

export const Clear = function (option = null) {
  this.sx = 0;
  this.sy = 0;
  this.ex = 0;
  this.ey = 0;
  if (option !== null) {
    this.sx = option.sx;
    this.sy = option.sy;
    this.ex = option.ex;
    this.ey = option.ey;
  } else {
    this.sx = 0;
    this.sy = 0;
    this.ex = this.canvas.width;
    this.ey = this.canvas.height;
  }
  this.clear = function () {
    this.clearRect(this.sx, this.sy, this.ex, this.ey);
  };
};

// 判断移动端类型判断
export const mobileTypeJudge = function () {
  var ua = navigator.userAgent;
  return {
    isMobile: /(iPhone|iPod|Android|ios)/i.test(ua),
    isAndroid: /(Android|Adr)/i.test(ua),
    isIOS: /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua),
    isWx: /micromessenger/i.test(ua),
    isQQ: /MQQBrowser/i.test(ua),
  };
};

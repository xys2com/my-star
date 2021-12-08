export function CreateWave({ waves, speed, scale, height, image: obj }) {
  return new Promise((res) => {
    let cvs = document.createElement("canvas");
    let cvs2 = document.createElement("canvas");
    let c = cvs.getContext("2d");
    let c2 = cvs2.getContext("2d");

    let imgLoad = false;
    const img = obj;
    img.parentNode.insertBefore(cvs2, img);
    img.parentNode.insertBefore(cvs, img);
    let w, h, dw, dh;
    let offset = 0,
      frame = 0,
      max_frames = 0,
      frames = [];
    c.save();

    cvs.width = img.width;
    cvs.height = img.height * 2;
    cvs.style.zIndex = "5";
    cvs.style.left = 0;
    cvs.style.top = 0;
    cvs.style.position = "absolute";

    cvs2.width = img.width;
    cvs2.height = img.height * 2;
    cvs2.style.zIndex = "4";
    cvs2.style.left = 0;
    cvs2.style.top = 0;
    cvs2.style.position = "absolute";

    // c.drawImage(img, 0, 0);
    c.scale(1, -1);
    c.drawImage(img, 0, -img.height * 2);

    imgLoad = true;

    c.restore();

    w = cvs.width;
    h = cvs.height;
    dw = w;
    dh = h * height; // 水波的 y 位置
    var id = c.getImageData(0, h * height, w, h).data; // 获取图片像素点阵色彩信息
    var end = false;
    c.save();
    while (!end) {
      // 图片信息
      var imgData = c.getImageData(0, h * height, w, h);
      // 图片像素点信息
      var pixels = imgData.data;
      var pixel = 0;
      for (var y = 0; y < dh; y++) {
        // 对二维数组进行遍历
        for (var x = 0; x < dw; x++) {
          // 模拟正弦波 来计算像素点的偏移位置
          var displacement =
            (scale * 8 * Math.sin(dh / (y / waves) + -offset)) | 0;
          var j = ((displacement + y) * w + x + displacement) * 4;
          if (j < 0) {
            pixel += 4;
            continue;
          }
          var m = j % (w * 4);
          var n = scale * 10 * (y / waves);
          if (m < n || m > w * 4 - n) {
            var sign = y < w / 2 ? 1 : -1;
            pixels[pixel] = pixels[pixel + 4 * sign];
            pixels[++pixel] = pixels[pixel + 4 * sign];
            pixels[++pixel] = pixels[pixel + 4 * sign];
            pixels[++pixel] = pixels[pixel + 4 * sign];
            ++pixel;
            continue;
          }

          if (id[j + 3] != 0) {
            pixels[pixel] = id[j];
            pixels[++pixel] = id[++j];
            pixels[++pixel] = id[++j];
            pixels[++pixel] = id[++j];
            ++pixel;
          } else {
            pixels[pixel] = pixels[pixel - w * 4];
            pixels[++pixel] = pixels[pixel - w * 4];
            pixels[++pixel] = pixels[pixel - w * 4];
            pixels[++pixel] = pixels[pixel - w * 4];
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
      frames.push(imgData);
    }
    c.restore();
    if (!img) {
      c.height = c.height / 2;
    }
    img.parentNode.removeChild(img);
    let notTime = Date.now();
    let grd = c2.createLinearGradient(0, cvs.height / 2, 1, cvs.height);
    grd.addColorStop(0, "#0e1b58");
    grd.addColorStop(0.5, "#040426");
    grd.addColorStop(1, "transparent");
    c2.fillStyle = grd;
    c2.moveTo(0, cvs.height / 2 + 20);
    c2.quadraticCurveTo(
      cvs.width / 2,
      cvs.height / 2 - 21,
      cvs.width,
      cvs.height / 2 + 20
    );
    c2.lineTo(cvs.width, document.body.clientHeight);
    c2.lineTo(0, document.body.clientHeight);
    c2.lineTo(0, cvs.height / 2 + 20);
    // c2.rect(0, cvs.height / 2, cvs.width, cvs.height);
    c2.fill();
    console;
    const fun = () => {
      const _now_time = Date.now();
      if (_now_time - notTime < 30) {
        return;
      }
      notTime = _now_time;
      c.fillStyle = grd;
      c.fill();
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
      name: "wave",
      fun,
    };
    res(option);
  });
}
